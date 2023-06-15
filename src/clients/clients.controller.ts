import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiResponse, ApiTags } from '@nestjs/swagger'
import { Client } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import to from 'await-to-js'
import { BearerDecoded } from 'src/auth/decorators/bearer-decoded.decorator'
import { JwtPayload } from 'src/auth/types/jwt-payload'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { ClientResponse } from './models/client.response'

@ApiTags('Clients')
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private readonly _service: ClientsService) {}

  @ApiResponse({ status: HttpStatus.CREATED, type: ClientResponse })
  @Post()
  public async create(
    @BearerDecoded() user: JwtPayload,
    @Body() dto: CreateClientDto
  ): Promise<Client> {
    return this._service.create(user.sub, dto)
  }

  @ApiResponse({ status: HttpStatus.OK, type: ClientResponse, isArray: true })
  @Get()
  public async findAll(@BearerDecoded() user: JwtPayload): Promise<Client[]> {
    return this._service.findAll(user.sub)
  }

  @ApiResponse({ status: HttpStatus.OK, type: ClientResponse })
  @Get(':id')
  public async findOne(@Param('id') id: number): Promise<Client> {
    const [error, client] = await to<Client, PrismaClientKnownRequestError>(
      this._service.findOne(+id)
    )

    if (error?.code === 'P2025') throw new NotFoundException('Client not found')

    return client
  }

  @ApiResponse({ status: HttpStatus.OK, type: ClientResponse })
  @Patch(':id')
  public async update(
    @BearerDecoded() user: JwtPayload,
    @Param('id') id: number,
    @Body() dto: UpdateClientDto
  ): Promise<Client> {
    const [error, client] = await to<Client, PrismaClientKnownRequestError>(
      this._service.update(user.sub, +id, dto)
    )

    if (error?.code === 'P2025') throw new NotFoundException('Client not found')

    return client
  }

  @ApiResponse({ status: HttpStatus.OK, type: ClientResponse })
  @Delete(':id')
  public async delete(
    @BearerDecoded() user: JwtPayload,
    @Param('id') id: number
  ): Promise<Client> {
    return this._service.delete(user.sub, +id)
  }
}
