import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';

export enum PaymentMethod {
  COD = 'cod',
  BANK_TRANSFER = 'bank_transfer',
  MOMO = 'momo',
  VNPAY = 'vnPay',
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Order, (order) => order.payment, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Index()
  @Column({ name: 'order_id', nullable: true, type: 'uuid' })
  orderId: string;

  @Column({ length: 50, nullable: true })
  method: string;

  @Index()
  @Column({ length: 30, nullable: true })
  status: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ name: 'paid_at', nullable: true })
  paidAt: Date;
}
