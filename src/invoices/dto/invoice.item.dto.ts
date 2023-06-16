import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class InvoiceItem {
  @IsString()
  @IsNotEmpty()
  public name: string

  @IsNumber()
  @IsNotEmpty()
  public quantity: number

  @IsNumber()
  @IsNotEmpty()
  public price: number
}
