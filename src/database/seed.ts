import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductColor } from '../entities/product-color.entity';
import { Customer } from '../entities/customer.entity';
import { Address } from '../entities/address.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { Payment, PaymentMethod, PaymentStatus } from '../entities/payment.entity';

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  // Clear existing data
  await AppDataSource.query('TRUNCATE TABLE payments, order_items, orders, addresses, customers, product_colors, products, categories RESTART IDENTITY CASCADE');
  console.log('Cleared existing data');

  // ===== CATEGORIES =====
  const categoryRepo = AppDataSource.getRepository(Category);
  const [alcoholCat, waterCat] = await categoryRepo.save([
    { name: 'Alcohol Markers', description: 'Bút marker gốc cồn, màu sắc tươi sáng, phù hợp vẽ chuyên nghiệp' },
    { name: 'Water-based Markers', description: 'Bút marker gốc nước, an toàn, phù hợp mọi lứa tuổi' },
  ]);
  console.log('Seeded categories');

  // ===== PRODUCTS =====
  const productRepo = AppDataSource.getRepository(Product);
  const products = await productRepo.save([
    {
      category: alcoholCat,
      name: 'Honolulu 320 Colors Dual Tips',
      series: 'Honolulu',
      nibType: 'Brush & Chisel',
      inkType: 'Alcohol-based',
      colorCount: 320,
      price: 2850000,
      stock: 15,
    },
    {
      category: alcoholCat,
      name: 'Honolulu 168 Colors Dual Tips',
      series: 'Honolulu',
      nibType: 'Brush & Chisel',
      inkType: 'Alcohol-based',
      colorCount: 168,
      price: 1650000,
      stock: 30,
    },
    {
      category: alcoholCat,
      name: 'Oahu 120 Colors Dual Tips',
      series: 'Oahu',
      nibType: 'Brush & Fine',
      inkType: 'Alcohol-based',
      colorCount: 120,
      price: 1250000,
      stock: 25,
    },
    {
      category: alcoholCat,
      name: 'Oahu 72 Colors Dual Tips',
      series: 'Oahu',
      nibType: 'Brush & Fine',
      inkType: 'Alcohol-based',
      colorCount: 72,
      price: 850000,
      stock: 40,
    },
    {
      category: alcoholCat,
      name: 'Honolulu B 48 Colors Dual Tips',
      series: 'Honolulu B',
      nibType: 'Brush & Chisel',
      inkType: 'Alcohol-based',
      colorCount: 48,
      price: 650000,
      stock: 50,
    },
    {
      category: alcoholCat,
      name: 'Kaala 24 Colors Single Tip',
      series: 'Kaala',
      nibType: 'Fine & Chisel',
      inkType: 'Alcohol-based',
      colorCount: 24,
      price: 380000,
      stock: 60,
    },
    {
      category: waterCat,
      name: 'Kaala Water 48 Colors Dual Tips',
      series: 'Kaala',
      nibType: 'Brush & Fine',
      inkType: 'Water-based',
      colorCount: 48,
      price: 520000,
      stock: 35,
    },
    {
      category: waterCat,
      name: 'Kaala Water 24 Colors Dual Tips',
      series: 'Kaala',
      nibType: 'Brush & Fine',
      inkType: 'Water-based',
      colorCount: 24,
      price: 320000,
      stock: 45,
    },
  ]);
  console.log('Seeded products');

  // ===== PRODUCT COLORS (cho bộ 24 màu) =====
  const colorRepo = AppDataSource.getRepository(ProductColor);
  const kaala24 = products[5];
  await colorRepo.save([
    { product: kaala24, colorCode: 'R01', colorName: 'Crimson Red', hexValue: '#DC143C' },
    { product: kaala24, colorCode: 'R05', colorName: 'Coral', hexValue: '#FF6B6B' },
    { product: kaala24, colorCode: 'O01', colorName: 'Orange', hexValue: '#FFA500' },
    { product: kaala24, colorCode: 'Y01', colorName: 'Lemon Yellow', hexValue: '#FFF44F' },
    { product: kaala24, colorCode: 'Y05', colorName: 'Golden Yellow', hexValue: '#FFD700' },
    { product: kaala24, colorCode: 'G01', colorName: 'Lime Green', hexValue: '#32CD32' },
    { product: kaala24, colorCode: 'G05', colorName: 'Forest Green', hexValue: '#228B22' },
    { product: kaala24, colorCode: 'BG1', colorName: 'Sky Blue', hexValue: '#87CEEB' },
    { product: kaala24, colorCode: 'B01', colorName: 'Royal Blue', hexValue: '#4169E1' },
    { product: kaala24, colorCode: 'B05', colorName: 'Navy Blue', hexValue: '#000080' },
    { product: kaala24, colorCode: 'V01', colorName: 'Lavender', hexValue: '#E6E6FA' },
    { product: kaala24, colorCode: 'V05', colorName: 'Purple', hexValue: '#800080' },
    { product: kaala24, colorCode: 'P01', colorName: 'Pink', hexValue: '#FFC0CB' },
    { product: kaala24, colorCode: 'BR1', colorName: 'Light Brown', hexValue: '#C4A265' },
    { product: kaala24, colorCode: 'BR3', colorName: 'Dark Brown', hexValue: '#5C3317' },
    { product: kaala24, colorCode: 'GR1', colorName: 'Light Gray', hexValue: '#D3D3D3' },
    { product: kaala24, colorCode: 'GR3', colorName: 'Dark Gray', hexValue: '#696969' },
    { product: kaala24, colorCode: 'BK1', colorName: 'Black', hexValue: '#000000' },
    { product: kaala24, colorCode: 'W01', colorName: 'White', hexValue: '#FFFFFF' },
    { product: kaala24, colorCode: 'SK1', colorName: 'Skin', hexValue: '#FFCBA4' },
    { product: kaala24, colorCode: 'SK3', colorName: 'Tan', hexValue: '#D2B48C' },
    { product: kaala24, colorCode: 'T01', colorName: 'Teal', hexValue: '#008080' },
    { product: kaala24, colorCode: 'M01', colorName: 'Magenta', hexValue: '#FF00FF' },
    { product: kaala24, colorCode: 'C01', colorName: 'Cyan', hexValue: '#00FFFF' },
  ]);
  console.log('Seeded product colors');

  // ===== CUSTOMERS =====
  const customerRepo = AppDataSource.getRepository(Customer);
  const customers = await customerRepo.save([
    { name: 'Nguyễn Văn An', email: 'an.nguyen@gmail.com', phone: '0901234567' },
    { name: 'Trần Thị Bình', email: 'binh.tran@gmail.com', phone: '0912345678' },
    { name: 'Lê Minh Châu', email: 'chau.le@gmail.com', phone: '0923456789' },
    { name: 'Phạm Thu Dung', email: 'dung.pham@gmail.com', phone: '0934567890' },
  ]);
  console.log('Seeded customers');

  // ===== ADDRESSES =====
  const addressRepo = AppDataSource.getRepository(Address);
  const addresses = await addressRepo.save([
    { customer: customers[0], address: '123 Nguyễn Huệ, Phường Bến Nghé', city: 'Hồ Chí Minh', isDefault: true },
    { customer: customers[0], address: '45 Lê Lợi, Phường Bến Thành', city: 'Hồ Chí Minh', isDefault: false },
    { customer: customers[1], address: '78 Hoàn Kiếm, Phường Hàng Trống', city: 'Hà Nội', isDefault: true },
    { customer: customers[2], address: '12 Trần Phú, Phường Hải Châu', city: 'Đà Nẵng', isDefault: true },
    { customer: customers[3], address: '56 Hai Bà Trưng, Phường Tân Định', city: 'Hồ Chí Minh', isDefault: true },
  ]);
  console.log('Seeded addresses');

  // ===== ORDERS =====
  const orderRepo = AppDataSource.getRepository(Order);
  const orders = await orderRepo.save([
    {
      customer: customers[0],
      address: addresses[0],
      status: OrderStatus.DELIVERED,
      totalAmount: 2850000,
    },
    {
      customer: customers[1],
      address: addresses[2],
      status: OrderStatus.SHIPPING,
      totalAmount: 2500000,
    },
    {
      customer: customers[2],
      address: addresses[3],
      status: OrderStatus.CONFIRMED,
      totalAmount: 850000,
    },
    {
      customer: customers[3],
      address: addresses[4],
      status: OrderStatus.PENDING,
      totalAmount: 840000,
    },
    {
      customer: customers[0],
      address: addresses[0],
      status: OrderStatus.CANCELLED,
      totalAmount: 650000,
    },
  ]);
  console.log('Seeded orders');

  // ===== ORDER ITEMS =====
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  await orderItemRepo.save([
    { order: orders[0], product: products[0], quantity: 1, unitPrice: 2850000 },
    { order: orders[1], product: products[1], quantity: 1, unitPrice: 1650000 },
    { order: orders[1], product: products[2], quantity: 1, unitPrice: 850000 },
    { order: orders[2], product: products[3], quantity: 1, unitPrice: 850000 },
    { order: orders[3], product: products[6], quantity: 1, unitPrice: 520000 },
    { order: orders[3], product: products[7], quantity: 1, unitPrice: 320000 },
    { order: orders[4], product: products[4], quantity: 1, unitPrice: 650000 },
  ]);
  console.log('Seeded order items');

  // ===== PAYMENTS =====
  const paymentRepo = AppDataSource.getRepository(Payment);
  await paymentRepo.save([
    {
      order: orders[0],
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PAID,
      amount: 2850000,
      paidAt: new Date('2026-05-10T10:30:00'),
    },
    {
      order: orders[1],
      method: PaymentMethod.MOMO,
      status: PaymentStatus.PAID,
      amount: 2500000,
      paidAt: new Date('2026-05-20T14:15:00'),
    },
    {
      order: orders[2],
      method: PaymentMethod.COD,
      status: PaymentStatus.PENDING,
      amount: 850000,
      paidAt: null,
    },
    {
      order: orders[3],
      method: PaymentMethod.VNPAY,
      status: PaymentStatus.PENDING,
      amount: 840000,
      paidAt: null,
    },
    {
      order: orders[4],
      method: PaymentMethod.COD,
      status: PaymentStatus.FAILED,
      amount: 650000,
      paidAt: null,
    },
  ]);
  console.log('Seeded payments');

  await AppDataSource.destroy();
  console.log('Done! Database seeded successfully.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
