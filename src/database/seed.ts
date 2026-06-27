import 'reflect-metadata';
import { AppDataSource } from './data-source';
import { Role } from '../entities/role.entity';
import { Account } from '../entities/account.entity';
import { Profile } from '../entities/profile.entity';
import { Brand } from '../entities/brand.entity';
import { Category } from '../entities/category.entity';
import { Product } from '../entities/product.entity';
import { ProductDetail } from '../entities/product-detail.entity';
import { Customer } from '../entities/customer.entity';
import { Address } from '../entities/address.entity';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from '../entities/payment.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Connected to database');

  // Clear existing data (order matters — FK constraints)
  await AppDataSource.query(`
    TRUNCATE TABLE
      payments, order_items, orders,
      addresses, customers,
      product_details, products,
      profiles, accounts,
      brands, categories
    RESTART IDENTITY CASCADE
  `);
  console.log('Cleared existing data');

  // ===== ROLES =====
  const roleRepo = AppDataSource.getRepository(Role);
  let userRole = await roleRepo.findOne({ where: { name: 'user' } });
  let adminRole = await roleRepo.findOne({ where: { name: 'admin' } });
  if (!userRole)
    userRole = await roleRepo.save(roleRepo.create({ name: 'user' }));
  if (!adminRole)
    adminRole = await roleRepo.save(roleRepo.create({ name: 'admin' }));
  console.log('Seeded roles');

  // ===== ACCOUNTS =====
  const accountRepo = AppDataSource.getRepository(Account);
  const profileRepo = AppDataSource.getRepository(Profile);
  const passwordHash = await bcrypt.hash('password123', 10);

  const accountData = [
    {
      username: 'admin',
      email: 'admin@japanesestore.vn',
      role: adminRole,
      fullName: 'Quản Trị Viên',
      phone: '0900000001',
    },
    {
      username: 'manager01',
      email: 'manager01@japanesestore.vn',
      role: adminRole,
      fullName: 'Nguyễn Quản Lý',
      phone: '0900000002',
    },
    {
      username: 'user_an',
      email: 'an.nguyen@gmail.com',
      role: userRole,
      fullName: 'Nguyễn Văn An',
      phone: '0901234567',
    },
    {
      username: 'user_binh',
      email: 'binh.tran@gmail.com',
      role: userRole,
      fullName: 'Trần Thị Bình',
      phone: '0912345678',
    },
    {
      username: 'user_chau',
      email: 'chau.le@gmail.com',
      role: userRole,
      fullName: 'Lê Minh Châu',
      phone: '0923456789',
    },
    {
      username: 'user_dung',
      email: 'dung.pham@gmail.com',
      role: userRole,
      fullName: 'Phạm Thu Dung',
      phone: '0934567890',
    },
    {
      username: 'user_em',
      email: 'em.hoang@gmail.com',
      role: userRole,
      fullName: 'Hoàng Thị Em',
      phone: '0945678901',
    },
    {
      username: 'user_giang',
      email: 'giang.vo@gmail.com',
      role: userRole,
      fullName: 'Võ Minh Giang',
      phone: '0956789012',
    },
    {
      username: 'user_hoa',
      email: 'hoa.dao@gmail.com',
      role: userRole,
      fullName: 'Đào Thị Hoa',
      phone: '0967890123',
    },
    {
      username: 'user_khoa',
      email: 'khoa.bui@gmail.com',
      role: userRole,
      fullName: 'Bùi Văn Khoa',
      phone: '0978901234',
    },
    {
      username: 'user_lan',
      email: 'lan.do@gmail.com',
      role: userRole,
      fullName: 'Đỗ Thị Lan',
      phone: '0989012345',
    },
    {
      username: 'user_minh',
      email: 'minh.phan@gmail.com',
      role: userRole,
      fullName: 'Phan Văn Minh',
      phone: '0990123456',
    },
  ];

  const accounts = await accountRepo.save(
    accountData.map((d) =>
      accountRepo.create({
        username: d.username,
        email: d.email,
        password: passwordHash,
        role: d.role,
      }),
    ),
  );

  await profileRepo.save(
    accounts.map((acc, i) =>
      profileRepo.create({
        account: acc,
        fullName: accountData[i].fullName,
        phone: accountData[i].phone,
        address: null,
        img: null,
      }),
    ),
  );
  console.log('Seeded accounts & profiles');

  // ===== BRANDS =====
  const brandRepo = AppDataSource.getRepository(Brand);
  const brands = await brandRepo.save([
    { name: 'Copic' },
    { name: 'Tombow' },
    { name: 'Pentel' },
    { name: 'Sakura' },
    { name: 'Kuretake' },
    { name: 'Holbein' },
    { name: 'Winsor & Newton' },
    { name: 'Faber-Castell' },
    { name: 'Staedtler' },
    { name: 'Pilot' },
    { name: 'Zebra' },
    { name: 'Mitsubishi Uni' },
  ]);
  console.log('Seeded brands');

  // ===== CATEGORIES =====
  const categoryRepo = AppDataSource.getRepository(Category);
  const categories = await categoryRepo.save([
    {
      name: 'Alcohol Markers',
      description:
        'Bút marker gốc cồn, màu tươi, blend tốt, phù hợp vẽ chuyên nghiệp',
    },
    {
      name: 'Water-based Markers',
      description: 'Bút marker gốc nước, an toàn, phù hợp mọi lứa tuổi',
    },
    {
      name: 'Brush Pens',
      description:
        'Bút lông mềm, nét đa dạng, dùng cho calligraphy và minh họa',
    },
    {
      name: 'Watercolor Sets',
      description: 'Bộ màu nước hạng nghề, bảng màu phong phú',
    },
    {
      name: 'Fine Line Pens',
      description:
        'Bút kẻ nét mảnh, mực không nhòe, dùng khi sketch và lineart',
    },
    {
      name: 'Calligraphy Sets',
      description: 'Bộ dụng cụ thư pháp Nhật, kèm mực và giấy washi',
    },
    {
      name: 'Sketch Pencils',
      description:
        'Bộ bút chì phác thảo đa cứng, dùng cho họa sĩ và sinh viên mỹ thuật',
    },
    {
      name: 'Accessories',
      description: 'Phụ kiện vẽ: thước, blender, giấy họa, bút giữ nhiều bút',
    },
    {
      name: 'Ink Sets',
      description: 'Mực màu đơn lẻ và bộ mực refill cho bút marker',
    },
    {
      name: 'Pastel & Chalk',
      description: 'Phấn màu mềm và cứng, dùng cho tranh nghệ thuật đường phố',
    },
    {
      name: 'Colored Pencils',
      description: 'Bút chì màu nước và dầu, nét mượt, bảng màu đầy đủ',
    },
    {
      name: 'Mixed Media',
      description:
        'Bộ đa phương tiện kết hợp nhiều chất liệu cho nghệ sĩ thử nghiệm',
    },
  ]);
  console.log('Seeded categories');

  // ===== PRODUCTS =====
  const productRepo = AppDataSource.getRepository(Product);
  const productDetailRepo = AppDataSource.getRepository(ProductDetail);

  const productData = [
    {
      name: 'Copic Sketch 72A Set',
      series: 'Copic Sketch',
      price: 4500000,
      brand: brands[0],
      category: categories[0],
      nibType: 'Super Brush & Medium Broad',
      inkType: 'Alcohol-based',
      stock: 10,
      descriptions: [
        'Bộ 72 màu phổ biến nhất',
        'Đầu Super Brush uốn cong linh hoạt',
        'Mực có thể refill',
      ],
    },
    {
      name: 'Copic Ciao 36 Colors Set',
      series: 'Copic Ciao',
      price: 1800000,
      brand: brands[0],
      category: categories[0],
      nibType: 'Super Brush & Medium Broad',
      inkType: 'Alcohol-based',
      stock: 20,
      descriptions: [
        'Phiên bản Ciao giá tốt hơn',
        'Dung tích mực ít hơn Sketch',
        'Lý tưởng cho người mới bắt đầu',
      ],
    },
    {
      name: 'Tombow Dual Brush 96 Colors',
      series: 'Tombow ABT',
      price: 3200000,
      brand: brands[1],
      category: categories[2],
      nibType: 'Flexible Brush & Fine',
      inkType: 'Water-based',
      stock: 15,
      descriptions: [
        'Đầu brush mềm như bút lông thật',
        'Đầu fine 0.8mm chính xác',
        'Có thể blend màu trực tiếp',
      ],
    },
    {
      name: 'Pentel Arts Color Brush 48',
      series: 'Pentel Color Brush',
      price: 980000,
      brand: brands[2],
      category: categories[2],
      nibType: 'Flexible Brush',
      inkType: 'Water-based',
      stock: 30,
      descriptions: [
        'Mực có thể pha loãng bằng nước',
        'Đầu lông mềm tự phục hồi',
        'Màu sắc tươi sáng',
      ],
    },
    {
      name: 'Sakura Koi Watercolor 72 Pan',
      series: 'Sakura Koi',
      price: 1250000,
      brand: brands[3],
      category: categories[3],
      nibType: null,
      inkType: 'Water-based',
      stock: 25,
      descriptions: [
        '72 màu nước chất lượng nghề',
        'Có kèm cọ lông và đĩa pha màu',
        'Màu trong và rực rỡ khi khô',
      ],
    },
    {
      name: 'Kuretake Zig Calligraphy 24 Set',
      series: 'Zig Calligraphy',
      price: 720000,
      brand: brands[4],
      category: categories[5],
      nibType: 'Chisel',
      inkType: 'Water-based',
      stock: 18,
      descriptions: [
        '24 màu thư pháp đẹp',
        'Đầu chisel 2 cỡ: 2mm và 3.5mm',
        'Phù hợp lettering và calligraphy',
      ],
    },
    {
      name: 'Holbein Artists Watercolor 108 Set',
      series: 'Holbein HWC',
      price: 5800000,
      brand: brands[5],
      category: categories[3],
      nibType: null,
      inkType: 'Water-based',
      stock: 8,
      descriptions: [
        'Hạng nghề cao cấp của Nhật',
        '108 màu nước thuần khiết',
        'Chất bền màu cực cao',
      ],
    },
    {
      name: 'Winsor & Newton Promarker 48',
      series: 'Promarker',
      price: 2600000,
      brand: brands[6],
      category: categories[0],
      nibType: 'Bullet & Chisel',
      inkType: 'Alcohol-based',
      stock: 12,
      descriptions: [
        'Đầu chisel và bullet tiện dụng',
        'Mực không nhòe khi chồng lớp',
        'Bền màu theo thời gian',
      ],
    },
    {
      name: 'Faber-Castell Pitt Artist Pen 48',
      series: 'Pitt Artist',
      price: 1650000,
      brand: brands[7],
      category: categories[4],
      nibType: 'Super Fine & Brush',
      inkType: 'Water-based',
      stock: 22,
      descriptions: [
        'Mực India archival không thấm nước',
        'Đa dạng đầu: XS, S, M, B, Brush',
        'Không phai, không nhòe',
      ],
    },
    {
      name: 'Staedtler Mars Lumograph 12 Set',
      series: 'Mars Lumograph',
      price: 320000,
      brand: brands[8],
      category: categories[6],
      nibType: 'Pencil',
      inkType: null,
      stock: 50,
      descriptions: [
        '12 cấp cứng từ 6H đến 6B',
        'Ruột chì bẻ không gãy',
        'Thích hợp phác thảo kỹ thuật',
      ],
    },
    {
      name: 'Pilot Parallel Calligraphy 4-Pen Set',
      series: 'Pilot Parallel',
      price: 890000,
      brand: brands[9],
      category: categories[5],
      nibType: 'Parallel Flat',
      inkType: 'Water-based',
      stock: 16,
      descriptions: [
        'Bộ 4 ngòi: 1.5, 2.4, 3.8, 6.0mm',
        'Có thể trộn màu ngay trên ngòi',
        'Kèm mực cartridge xanh và đỏ',
      ],
    },
    {
      name: 'Mitsubishi Uni Colored Pencil 100 Set',
      series: 'Uni Color 100',
      price: 2100000,
      brand: brands[11],
      category: categories[10],
      nibType: 'Pencil',
      inkType: null,
      stock: 14,
      descriptions: [
        '100 màu phong phú nhất dòng Uni',
        'Lõi mịn, không gãy, tô mượt',
        'Phù hợp minh họa chuyên nghiệp',
      ],
    },
  ];

  const products = await productRepo.save(
    productData.map((d) =>
      productRepo.create({
        name: d.name,
        series: d.series,
        price: d.price,
        brand: d.brand,
        category: d.category,
      }),
    ),
  );

  await productDetailRepo.save(
    products.map((p, i) =>
      productDetailRepo.create({
        product: p,
        nibType: productData[i].nibType,
        inkType: productData[i].inkType,
        stock: productData[i].stock,
        isActive: true,
        descriptions: productData[i].descriptions,
      }),
    ),
  );
  console.log('Seeded products & product details');

  // ===== CUSTOMERS =====
  const customerRepo = AppDataSource.getRepository(Customer);
  const customers = await customerRepo.save([
    {
      name: 'Nguyễn Văn An',
      email: 'customer.an@gmail.com',
      phone: '0901234567',
    },
    {
      name: 'Trần Thị Bình',
      email: 'customer.binh@gmail.com',
      phone: '0912345678',
    },
    {
      name: 'Lê Minh Châu',
      email: 'customer.chau@gmail.com',
      phone: '0923456789',
    },
    {
      name: 'Phạm Thu Dung',
      email: 'customer.dung@gmail.com',
      phone: '0934567890',
    },
    {
      name: 'Hoàng Thị Em',
      email: 'customer.em@gmail.com',
      phone: '0945678901',
    },
    {
      name: 'Vũ Quốc Giang',
      email: 'customer.giang@gmail.com',
      phone: '0956789012',
    },
    {
      name: 'Đỗ Thị Hoa',
      email: 'customer.hoa@gmail.com',
      phone: '0967890123',
    },
    {
      name: 'Bùi Văn Khoa',
      email: 'customer.khoa@gmail.com',
      phone: '0978901234',
    },
    {
      name: 'Ngô Thị Lan',
      email: 'customer.lan@gmail.com',
      phone: '0989012345',
    },
    {
      name: 'Đinh Văn Minh',
      email: 'customer.minh@gmail.com',
      phone: '0990123456',
    },
    {
      name: 'Cao Thị Nga',
      email: 'customer.nga@gmail.com',
      phone: '0901111222',
    },
    {
      name: 'Đặng Văn Phúc',
      email: 'customer.phuc@gmail.com',
      phone: '0912222333',
    },
  ]);
  console.log('Seeded customers');

  // ===== ADDRESSES =====
  const addressRepo = AppDataSource.getRepository(Address);
  const addresses = await addressRepo.save([
    {
      customer: customers[0],
      address: '123 Nguyễn Huệ, P. Bến Nghé',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
    {
      customer: customers[1],
      address: '78 Hoàn Kiếm, P. Hàng Trống',
      city: 'Hà Nội',
      isDefault: true,
    },
    {
      customer: customers[2],
      address: '12 Trần Phú, P. Hải Châu',
      city: 'Đà Nẵng',
      isDefault: true,
    },
    {
      customer: customers[3],
      address: '56 Hai Bà Trưng, P. Tân Định',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
    {
      customer: customers[4],
      address: '90 Điện Biên Phủ, P. 15, Q. Bình Thạnh',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
    {
      customer: customers[5],
      address: '34 Lê Duẩn, P. Bến Nghé',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
    {
      customer: customers[6],
      address: '67 Nguyễn Trãi, P. Nguyễn Cư Trinh',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
    {
      customer: customers[7],
      address: '15 Cầu Giấy, P. Dịch Vọng',
      city: 'Hà Nội',
      isDefault: true,
    },
    {
      customer: customers[8],
      address: '43 Lạch Tray, P. Đằng Giang',
      city: 'Hải Phòng',
      isDefault: true,
    },
    {
      customer: customers[9],
      address: '29 Nguyễn Văn Linh, P. Vĩnh Trung',
      city: 'Đà Nẵng',
      isDefault: true,
    },
    {
      customer: customers[10],
      address: '8 Trường Chinh, P. Tây Thạnh',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
    {
      customer: customers[11],
      address: '100 Quang Trung, P. Hiệp Phú',
      city: 'Hồ Chí Minh',
      isDefault: true,
    },
  ]);
  console.log('Seeded addresses');

  // ===== ORDERS =====
  const orderRepo = AppDataSource.getRepository(Order);
  const orders = await orderRepo.save([
    {
      customer: customers[0],
      address: addresses[0],
      status: OrderStatus.DELIVERED,
      totalAmount: 4500000,
    },
    {
      customer: customers[1],
      address: addresses[1],
      status: OrderStatus.SHIPPING,
      totalAmount: 3200000,
    },
    {
      customer: customers[2],
      address: addresses[2],
      status: OrderStatus.CONFIRMED,
      totalAmount: 1800000,
    },
    {
      customer: customers[3],
      address: addresses[3],
      status: OrderStatus.PENDING,
      totalAmount: 2600000,
    },
    {
      customer: customers[4],
      address: addresses[4],
      status: OrderStatus.DELIVERED,
      totalAmount: 980000,
    },
    {
      customer: customers[5],
      address: addresses[5],
      status: OrderStatus.CANCELLED,
      totalAmount: 720000,
    },
    {
      customer: customers[6],
      address: addresses[6],
      status: OrderStatus.SHIPPING,
      totalAmount: 5800000,
    },
    {
      customer: customers[7],
      address: addresses[7],
      status: OrderStatus.CONFIRMED,
      totalAmount: 1250000,
    },
    {
      customer: customers[8],
      address: addresses[8],
      status: OrderStatus.PENDING,
      totalAmount: 890000,
    },
    {
      customer: customers[9],
      address: addresses[9],
      status: OrderStatus.DELIVERED,
      totalAmount: 2100000,
    },
    {
      customer: customers[10],
      address: addresses[10],
      status: OrderStatus.SHIPPING,
      totalAmount: 1650000,
    },
    {
      customer: customers[11],
      address: addresses[11],
      status: OrderStatus.CONFIRMED,
      totalAmount: 320000,
    },
  ]);
  console.log('Seeded orders');

  // ===== ORDER ITEMS =====
  const orderItemRepo = AppDataSource.getRepository(OrderItem);
  await orderItemRepo.save([
    { order: orders[0], product: products[0], quantity: 1, unitPrice: 4500000 },
    { order: orders[1], product: products[2], quantity: 1, unitPrice: 3200000 },
    { order: orders[2], product: products[1], quantity: 1, unitPrice: 1800000 },
    { order: orders[3], product: products[7], quantity: 1, unitPrice: 2600000 },
    { order: orders[4], product: products[3], quantity: 1, unitPrice: 980000 },
    { order: orders[5], product: products[5], quantity: 1, unitPrice: 720000 },
    { order: orders[6], product: products[6], quantity: 1, unitPrice: 5800000 },
    { order: orders[7], product: products[4], quantity: 1, unitPrice: 1250000 },
    { order: orders[8], product: products[10], quantity: 1, unitPrice: 890000 },
    {
      order: orders[9],
      product: products[11],
      quantity: 1,
      unitPrice: 2100000,
    },
    {
      order: orders[10],
      product: products[8],
      quantity: 1,
      unitPrice: 1650000,
    },
    { order: orders[11], product: products[9], quantity: 1, unitPrice: 320000 },
  ]);
  console.log('Seeded order items');

  // ===== PAYMENTS =====
  const paymentRepo = AppDataSource.getRepository(Payment);
  await paymentRepo.save([
    {
      order: orders[0],
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PAID,
      amount: 4500000,
      paidAt: new Date('2026-05-01T10:00:00'),
    },
    {
      order: orders[1],
      method: PaymentMethod.MOMO,
      status: PaymentStatus.PAID,
      amount: 3200000,
      paidAt: new Date('2026-05-10T14:30:00'),
    },
    {
      order: orders[2],
      method: PaymentMethod.COD,
      status: PaymentStatus.PENDING,
      amount: 1800000,
      paidAt: null,
    },
    {
      order: orders[3],
      method: PaymentMethod.VNPAY,
      status: PaymentStatus.PENDING,
      amount: 2600000,
      paidAt: null,
    },
    {
      order: orders[4],
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PAID,
      amount: 980000,
      paidAt: new Date('2026-05-15T09:15:00'),
    },
    {
      order: orders[5],
      method: PaymentMethod.COD,
      status: PaymentStatus.FAILED,
      amount: 720000,
      paidAt: null,
    },
    {
      order: orders[6],
      method: PaymentMethod.MOMO,
      status: PaymentStatus.PAID,
      amount: 5800000,
      paidAt: new Date('2026-05-20T16:45:00'),
    },
    {
      order: orders[7],
      method: PaymentMethod.VNPAY,
      status: PaymentStatus.PENDING,
      amount: 1250000,
      paidAt: null,
    },
    {
      order: orders[8],
      method: PaymentMethod.COD,
      status: PaymentStatus.PENDING,
      amount: 890000,
      paidAt: null,
    },
    {
      order: orders[9],
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PAID,
      amount: 2100000,
      paidAt: new Date('2026-06-01T11:20:00'),
    },
    {
      order: orders[10],
      method: PaymentMethod.MOMO,
      status: PaymentStatus.PAID,
      amount: 1650000,
      paidAt: new Date('2026-06-10T08:00:00'),
    },
    {
      order: orders[11],
      method: PaymentMethod.COD,
      status: PaymentStatus.PENDING,
      amount: 320000,
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
