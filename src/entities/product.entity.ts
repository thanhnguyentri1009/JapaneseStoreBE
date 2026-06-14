import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { OrderItem } from './order-item.entity';

@Index(['series', 'inkType'])
@Index(['isActive', 'categoryId'])
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index()
  @Column({ name: 'category_id', nullable: true, type: 'uuid' })
  categoryId: string;

  @ManyToOne(() => Brand, (brand) => brand.products, { nullable: true })
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @Index()
  @Column({ name: 'brand_id', nullable: true, type: 'uuid' })
  brandId: string;

  @Column({ length: 200 })
  name: string;

  @Index()
  @Column({ length: 50, nullable: true })
  series: string;

  @Column({ name: 'nib_type', length: 50, nullable: true })
  nibType: string;

  @Index()
  @Column({ name: 'ink_type', length: 30, nullable: true })
  inkType: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Index()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];
}
