import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Customer } from './customer.entity';
import { Order } from './order.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Customer, (customer) => customer.addresses, {
    nullable: true,
  })
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Index()
  @Column({ name: 'customer_id', nullable: true, type: 'uuid' })
  customerId: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, default: 'Vietnam' })
  country: string;

  @Column({ name: 'is_default', default: false })
  isDefault: boolean;

  @OneToMany(() => Order, (order) => order.address)
  orders: Order[];
}
