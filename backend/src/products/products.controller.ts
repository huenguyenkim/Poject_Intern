import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, UseInterceptors, ParseIntPipe, Request, Headers, Ip } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { 
  GetProductsUseCase, 
  GetProductByIdUseCase, 
  CreateProductUseCase, 
  UpdateProductUseCase, 
  DeleteProductUseCase 
} from '../core/application/usecases/ProductUseCases';
import { Product } from '../core/domain/entities/Product';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  findAll(): Promise<Product[]> {
    return this.getProductsUseCase.execute();
  }

  @UseInterceptors(CacheInterceptor)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Product> {
    return this.getProductByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: Partial<Product>): Promise<Product> {
    return this.createProductUseCase.execute(data);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() data: Partial<Product>,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ): Promise<Product> {
    const userId = req.user ? req.user.id : 0;
    // Capture real IP from headers if proxied (x-forwarded-for)
    const realIp = req.headers['x-forwarded-for'] || ip;
    return this.updateProductUseCase.execute(id, data, { userId, ip: realIp, ua });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ): Promise<void> {
    const userId = req.user ? req.user.id : 0;
    const realIp = req.headers['x-forwarded-for'] || ip;
    return this.deleteProductUseCase.execute(id, { userId, ip: realIp, ua });
  }
}
