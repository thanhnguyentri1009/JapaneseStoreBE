import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Order } from '../../entities/order.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly resend: Resend;

  constructor(private readonly config: ConfigService) {
    this.resend = new Resend(config.get('RESEND_API_KEY'));
  }

  async sendOrderConfirmation(email: string, order: Order): Promise<void> {
    try {
      const { error } = await this.resend.emails.send({
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
      // resend never throws for API-level failures (e.g. quota exceeded) —
      // it always resolves with { error }, so this must be checked explicitly.
      if (error) {
        this.logger.error(
          `Failed to send order confirmation to ${email}: [${error.name}] ${error.message}`,
        );
      }
    } catch (err) {
      this.logger.error(`Failed to send order confirmation to ${email}`, err);
    }
  }
}
