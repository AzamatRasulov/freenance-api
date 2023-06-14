import { IsNotEmpty, IsString } from 'class-validator'

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  public street: string

  @IsString()
  @IsNotEmpty()
  public city: string

  @IsString()
  @IsNotEmpty()
  public postCode: string

  @IsString()
  @IsNotEmpty()
  public country: string
}
