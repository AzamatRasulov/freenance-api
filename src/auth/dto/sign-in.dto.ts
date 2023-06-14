import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string

  @IsString()
  @IsNotEmpty()
  public password: string
}
