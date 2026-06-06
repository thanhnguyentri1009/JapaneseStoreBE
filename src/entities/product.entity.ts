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
import { ProductColor } from './product-color.entity';
import { OrderItem } from './order-item.entity';

@Index(['series', 'inkType'])
@Index(['isActive', 'categoryId'])
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.products, { nullable: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Index()
  @Column({ name: 'category_id', nullable: true })
  categoryId: number;

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

  @Column({ name: 'color_count', nullable: true })
  colorCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Index()
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ProductColor, (color) => color.product)
  colors: ProductColor[];

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];
}
