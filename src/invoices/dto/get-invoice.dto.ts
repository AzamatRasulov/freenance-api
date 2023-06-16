import { Entity } from 'src/core/types/entity.type'
import { CreateInvoiceDto } from './create-invoice.dto'

export class GetInvoiceDto extends CreateInvoiceDto implements Entity {
  public id: number
  public createdAt: Date
  public updatedAt: Date
}
