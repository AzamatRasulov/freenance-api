import { ApiProperty } from '@nestjs/swagger'
import { Entity } from 'src/core/types/entity.type'

class Address {
  @ApiProperty()
  public street: string

  @ApiProperty()
  public city: string

  @ApiProperty()
  public postCode: string

  @ApiProperty()
  public country: string
}

export class ClientResponse implements Entity {
  @ApiProperty()
  public id: number

  @ApiProperty()
  public createdAt: Date

  @ApiProperty()
  public updatedAt: Date

  @ApiProperty()
  public logo: string

  @ApiProperty()
  public name: string

  @ApiProperty()
  public email: string

  @ApiProperty()
  public comment: string

  @ApiProperty()
  public address: Address

  @ApiProperty()
  public turnover: number
}
