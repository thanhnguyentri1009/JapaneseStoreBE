import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Order } from '../../entities/order.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('MAIL_HOST'),
      port: config.get<number>('MAIL_PORT', 587),
      auth: {
        user: config.get('MAIL_USER'),
        pass: config.get('MAIL_PASS'),
      },
    });
  }

  async sendOrderConfirmation(email: string, order: Order): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.config.get('MAIL_FROM', 'noreply@japanesestore.com'),
        to: email,
        subject: `Đặt hàng thành công - Mã đơn #${order.id.slice(0, 8).toUpperCase()}`,
        html: `
          <h2>Cảm ơn bạn đã đặt hàng!</h2>
          <p>Đơn hàng <strong>#${order.id.slice(0, 8).toUpperCase()}</strong> của bạn đã được tiếp nhận.</p>
          <p>Tổng tiền: <strong>${Number(order.totalAmount).toLocaleString('vi-VN')} VNĐ</strong></p>
          <p>Trạng thái: <strong>${order.status}</strong></p>
          <p>Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
        `,
      });
    } catch (err) {
      this.logger.error(`Failed to send order confirmation to ${email}`, err);
    }
  }
}
