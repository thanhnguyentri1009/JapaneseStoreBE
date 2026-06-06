import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './product.entity';

@Entity('product_colors')
export class ProductColor {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.colors, { nullable: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Index()
  @Column({ name: 'product_id', nullable: true })
  productId: number;

  @Column({ name: 'color_code', length: 20, nullable: true })
  colorCode: string;

  @Column({ name: 'color_name', length: 100, nullable: true })
  colorName: string;

  @Column({ name: 'hex_value', length: 7, nullable: true })
  hexValue: string;
}
