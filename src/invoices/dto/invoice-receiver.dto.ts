import { Type } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator'
import { AddressDto } from 'src/core/dto/address.dto'

export class InvoiceReceiverDto {
  @IsString()
  @IsNotEmpty()
  public name: string

  @IsEmail()
  @IsNotEmpty()
  public email: string

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto
}
