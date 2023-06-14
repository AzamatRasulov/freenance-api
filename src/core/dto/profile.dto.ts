import { Type } from 'class-transformer'
import { IsNotEmpty, IsObject, IsString, ValidateNested } from 'class-validator'
import { AddressDto } from './address.dto'

export class ProfileDto {
  public avatar: string

  @IsString()
  @IsNotEmpty()
  public name: string

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto
}
