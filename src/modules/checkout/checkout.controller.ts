import { Body, Controller, Inject, Post, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CHECKOUT_SERVICE,
  ICheckoutService,
} from './interfaces/checkout-service.interface';
import { CheckoutDto } from './dto/checkout.dto';

@ApiBearerAuth()
@Controller('checkout')
export class CheckoutController {
  constructor(
    @Inject(CHECKOUT_SERVICE)
    private readonly service: ICheckoutService,
  ) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  checkout(@Req() req: any, @Body() dto: CheckoutDto) {
    return this.service.checkout(req.user.sub, dto);
  }
}
