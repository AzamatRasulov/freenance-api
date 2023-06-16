import { AddressDto } from 'src/core/dto/address.dto'
import { Entity } from 'src/core/types/entity.type'

export class GetClientDto implements Entity {
  public id: number
  public createdAt: Date
  public updatedAt: Date

  public logo: string
  public name: string
  public email: string
  public comment: string
  public address: AddressDto
  public turnover: number
  public lastInvoiceId: number
}
