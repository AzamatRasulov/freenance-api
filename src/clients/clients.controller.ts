import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Client } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import to from 'await-to-js'
import { BearerDecoded } from 'src/auth/decorators/bearer-decoded.decorator'
import { JwtPayload } from 'src/auth/types/jwt-payload'
import { PostResponseDto } from 'src/core/dto/post.response.dto'
import { ClientsService } from './clients.service'
import { CreateClientDto } from './dto/create-client.dto'
import { GetClientDto } from './dto/get-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { LogoInterceptor } from './interceptors/logo.interceptor'
import { ParseLogoPipe } from './pipes/parse-logo.pipe'

@ApiTags('Clients')
@UseGuards(AuthGuard('jwt'))
@Controller('clients')
export class ClientsController {
  constructor(private readonly _service: ClientsService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateClientDto })
  @ApiResponse({ status: HttpStatus.CREATED, type: PostResponseDto })
  @UseInterceptors(LogoInterceptor())
  public async create(
    @BearerDecoded() user: JwtPayload,
    @UploadedFile(new ParseLogoPipe())
    { filename }: Express.Multer.File,
    @Body() dto: CreateClientDto
  ): Promise<Partial<Client>> {
    return this._service.create(user.sub, filename, dto)
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    type: GetClientDto,
    isArray: true
  })
  public async findAll(@BearerDecoded() user: JwtPayload): Promise<Client[]> {
    return this._service.findAll(user.sub)
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: GetClientDto })
  public async findOne(@Param('id') id: number): Promise<Client> {
    const [error, client] = await to<Client, PrismaClientKnownRequestError>(
      this._service.findOne(+id)
    )

    if (error?.code === 'P2025') throw new NotFoundException('Client not found')

    return client
  }

  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(LogoInterceptor())
  public async update(
    @Param('id') id: number,
    @BearerDecoded() user: JwtPayload,
    @UploadedFile(new ParseLogoPipe())
    { filename }: Express.Multer.File,
    @Body() dto: UpdateClientDto
  ): Promise<void> {
    const [error] = await to<void, PrismaClientKnownRequestError>(
      this._service.update(user.sub, +id, filename, dto)
    )

    if (error?.code === 'P2025') throw new NotFoundException('Client not found')
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'No content' })
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(
    @BearerDecoded() user: JwtPayload,
    @Param('id') id: number
  ): Promise<void> {
    return this._service.delete(user.sub, +id)
  }
}
