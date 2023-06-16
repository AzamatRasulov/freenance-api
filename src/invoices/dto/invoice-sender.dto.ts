import { Type } from 'class-transformer'
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator'
import { AddressDto } from 'src/core/dto/address.dto'

export class InvoiceSenderDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto
}
