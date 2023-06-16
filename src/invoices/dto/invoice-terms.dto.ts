import { Type } from 'class-transformer'
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested
} from 'class-validator'
import { InvoiceItem } from './invoice.item.dto'

export class InvoiceTermsDto {
  @IsISO8601()
  @IsNotEmpty()
  public dueDate: string

  @IsString()
  public description?: string

  @IsArray()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceItem)
  public items: InvoiceItem[]

  @IsNumber()
  @IsOptional()
  public amountDue?: number
}
