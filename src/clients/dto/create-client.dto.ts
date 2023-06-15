import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested
} from 'class-validator'
import { AddressDto } from 'src/core/dto/address.dto'
import { FileUploadDto } from 'src/core/dto/file-upload.dto'

export class CreateClientDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  public logo: FileUploadDto

  @IsString()
  @IsNotEmpty()
  public name: string

  @IsEmail()
  @IsNotEmpty()
  public email: string

  @IsString()
  public comment?: string

  @IsObject()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDto)
  public address: AddressDto
}
