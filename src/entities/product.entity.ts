import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { OrderItem } from './order-item.entity';
import { ProductDetail } from './product-detail.entity';

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

  @Column({ nullable: true })
  image: string;

  @Index()
  @Column({ length: 50, nullable: true })
  series: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => OrderItem, (item) => item.product)
  orderItems: OrderItem[];

  @OneToOne(() => ProductDetail, (detail) => detail.product)
  detail: ProductDetail;
}
