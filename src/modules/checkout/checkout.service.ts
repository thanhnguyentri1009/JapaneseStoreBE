import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { Account } from '../../entities/account.entity';
import { Customer } from '../../entities/customer.entity';
import { Address } from '../../entities/address.entity';
import { Order, OrderStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { Product } from '../../entities/product.entity';
import { Payment, PaymentStatus } from '../../entities/payment.entity';
import { ICheckoutService } from './interfaces/checkout-service.interface';
import { CheckoutDto } from './dto/checkout.dto';
import { OrderResponseDto } from '../order/dto/order-response.dto';
import { OrderGateway } from '../order/order.gateway';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CheckoutService implements ICheckoutService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly gateway: OrderGateway,
    private readonly mailService: MailService,
  ) {}

  async checkout(
    accountId: string,
    dto: CheckoutDto,
  ): Promise<OrderResponseDto> {
    if (!dto.addressId && !dto.newAddress) {
      throw new BadRequestException(
        'Either addressId or newAddress is required',
      );
    }

    const orderId = await this.dataSource.transaction(async (manager) => {
      const customer = await this.resolveCustomer(manager, accountId, dto);
      const address = await this.resolveAddress(manager, customer.id, dto);

      const order = await manager.save(
        manager.create(Order, {
          customerId: customer.id,
          addressId: address?.id,
          status: OrderStatus.PENDING,
          totalAmount: 0,
        }),
      );

      let total = 0;
      for (const itemDto of dto.items) {
        const product = await manager.findOne(Product, {
          where: { id: itemDto.productId },
          relations: ['detail'],
        });
        if (!product)
          throw new NotFoundException(
            `Product #${itemDto.productId} not found`,
          );
        if (!product.detail || product.detail.stock < itemDto.quantity)
          throw new BadRequestException(
            `Insufficient stock for product #${itemDto.productId}`,
          );

        product.detail.stock -= itemDto.quantity;
        await manager.save(product.detail);

        await manager.save(
          manager.create(OrderItem, {
            orderId: order.id,
            productId: product.id,
            quantity: itemDto.quantity,
            unitPrice: product.price,
          }),
        );

        total += Number(product.price) * itemDto.quantity;
      }

      await manager.update(Order, order.id, { totalAmount: total });

      if (dto.paymentMethod) {
        await manager.save(
          manager.create(Payment, {
            orderId: order.id,
            method: dto.paymentMethod,
            status: PaymentStatus.PENDING,
            amount: total,
          }),
        );
      }

      return order.id;
    });

    const order = await this.dataSource.getRepository(Order).findOne({
      where: { id: orderId },
      relations: ['items', 'items.product', 'payment', 'address'],
    });

    this.gateway.notifyNewOrder(order);

    const customer = await this.dataSource
      .getRepository(Customer)
      .findOne({ where: { id: order.customerId } });
    if (customer) {
      await this.mailService.sendOrderConfirmation(customer.email, order);
    }

    return OrderResponseDto.from(order);
  }

  private async resolveCustomer(
    manager: EntityManager,
    accountId: string,
    dto: CheckoutDto,
  ): Promise<Customer> {
    const account = await manager.findOne(Account, {
      where: { id: accountId },
    });
    if (!account) throw new NotFoundException(`Account #${accountId} not found`);

    const existing = await manager.findOne(Customer, {
      where: { accountId },
    });

    if (existing) {
      return manager.save(Customer, {
        ...existing,
        name: dto.name ?? existing.name,
        phone: dto.phone ?? existing.phone,
        email: dto.email ?? existing.email,
      });
    }

    const email = dto.email ?? account.email;
    const byEmail = await manager.findOne(Customer, { where: { email } });

    if (byEmail) {
      // A customer with this email already exists but isn't linked to any
      // account (e.g. created via the old guest/admin CRUD flow) — claim it
      // for this account instead of hitting the unique-email constraint.
      // If it's already linked to a *different* account, refuse instead of
      // silently merging two different accounts' identities.
      if (byEmail.accountId)
        throw new ConflictException(
          `Email "${email}" is already linked to another account`,
        );

      return manager.save(Customer, {
        ...byEmail,
        accountId,
        name: dto.name ?? byEmail.name,
        phone: dto.phone ?? byEmail.phone,
        isRegistered: true,
      });
    }

    return manager.save(
      manager.create(Customer, {
        accountId,
        name: dto.name,
        phone: dto.phone,
        email,
        isRegistered: true,
      }),
    );
  }

  private async resolveAddress(
    manager: EntityManager,
    customerId: string,
    dto: CheckoutDto,
  ): Promise<Address | null> {
    if (dto.addressId) {
      const address = await manager.findOne(Address, {
        where: { id: dto.addressId, customerId },
      });
      if (!address)
        throw new NotFoundException(
          `Address #${dto.addressId} not found for this customer`,
        );
      return address;
    }

    return manager.save(
      manager.create(Address, {
        customerId,
        address: dto.newAddress.address,
        city: dto.newAddress.city,
        country: dto.newAddress.country,
      }),
    );
  }
}
