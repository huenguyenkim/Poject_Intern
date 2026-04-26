import { Controller, Post, Get, Body, Patch, Param, Query, ParseIntPipe, HttpCode, HttpStatus, UseGuards, Request, Ip, Headers, UseInterceptors } from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from '../common/constants/order-status.enum';
import { JwtAuthGuard, RolesGuard } from '../infrastructure/auth/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/constants/user-role.enum';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(CacheInterceptor)
  async findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.ordersService.findAll(+page, +limit);
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.ordersService.findByUser(req.user.id, +page, +limit);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    // Check if user is admin, if so, allow viewing any order
    // Otherwise, pass req.user.id to check ownership
    const userId = req.user.role === UserRole.ADMIN ? undefined : req.user.id;
    return this.ordersService.findOne(id, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
    @Request() req,
  ) {
    console.log('📦 Create Order Body:', JSON.stringify(createOrderDto, null, 2));
    const realIp = req.headers['x-forwarded-for'] || ip;
    return this.ordersService.createOrder(createOrderDto, { ip: realIp, ua });
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: OrderStatus,
    @Request() req,
    @Ip() ip: string,
    @Headers('user-agent') ua: string,
  ) {
    const userId = req.user ? req.user.id : 0;
    const realIp = req.headers['x-forwarded-for'] || ip;
    return this.ordersService.updateStatus(id, status, { userId, ip: realIp, ua });
  }
}
