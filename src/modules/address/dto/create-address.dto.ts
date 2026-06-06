export class CreateAddressDto {
  customerId: number;
  address: string;
  city?: string;
  country?: string;
  isDefault?: boolean;
}
