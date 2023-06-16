import { Type } from 'class-transformer'
import { IsNotEmpty, IsObject, ValidateNested } from 'class-validator'
import { InvoiceReceiverDto } from './invoice-receiver.dto'
import { InvoiceSenderDto } from './invoice-sender.dto'
import { InvoiceTermsDto } from './invoice-terms.dto'

export class CreateInvoiceDto {
  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceSenderDto)
  public from: InvoiceSenderDto

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceReceiverDto)
  public to: InvoiceReceiverDto

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => InvoiceTermsDto)
  public terms: InvoiceTermsDto
}
