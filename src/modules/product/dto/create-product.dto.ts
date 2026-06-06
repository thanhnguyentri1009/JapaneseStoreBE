export class CreateProductDto {
  categoryId?: number;
  name: string;
  series?: string;
  nibType?: string;
  inkType?: string;
  colorCount?: number;
  price: number;
  stock?: number;
  isActive?: boolean;
}
