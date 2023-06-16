import { IsOptional, IsString } from 'class-validator'

export class GetClientsQueryDto {
  @IsString()
  @IsOptional()
  public country: string
}
