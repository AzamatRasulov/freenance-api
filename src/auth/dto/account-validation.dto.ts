import { IsEmail, IsNotEmpty } from 'class-validator'

export class AccountValidationDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string
}
