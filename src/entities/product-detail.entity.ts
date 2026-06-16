import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';

@Entity('product_details')
export class ProductDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Product, (product) => product.detail)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index()
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'nib_type', length: 50, nullable: true })
  nibType: string;

  @Index()
  @Column({ name: 'ink_type', length: 30, nullable: true })
  inkType: string;

  @Column({ default: 0 })
  stock: number;

  @Index()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'text', array: true, nullable: true })
  descriptions: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
