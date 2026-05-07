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
  
  @Post('manual-seed')
  async manualSeed() {
    await this.ordersService.manualSeedCoupons();
    return { message: 'Coupons seeded' };
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(CacheInterceptor)
  async findAll(
    @Query('page') page: number = 1, 
    @Query('limit') limit: number = 10,
    @Query('status') status?: OrderStatus,
    @Query('query') query?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.ordersService.findAll(+page, +limit, { status, query, startDate, endDate });
  }

  @Get('metrics')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async getMetrics() {
    return this.ordersService.getMetrics();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  async getMyOrders(@Request() req, @Query('page') page: number = 1, @Query('limit') limit: number = 10) {
    return this.ordersService.findByUser(req.user.id, +page, +limit);
  }

  @Get('purchased-products')
  @UseGuards(JwtAuthGuard)
  async getPurchasedProducts(@Request() req) {
    return this.ordersService.getPurchasedProductIds(req.user.id);
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
    return this.ordersService.createOrder(createOrderDto, { userId: req.user.id, ip: realIp, ua });
  }

  @Post('validate-coupon')
  @UseGuards(JwtAuthGuard)
  async validateCoupon(@Body('code') code: string, @Body('subtotal') subtotal: number, @Request() req) {
    console.log(`Validating coupon: ${code} for subtotal: ${subtotal}, user: ${req.user?.id}`);
    try {
      return await this.ordersService.validateCoupon(code, Number(subtotal), req.user?.id);
    } catch (e) {
      console.error(`Coupon validation error: ${e.message}`);
      throw e;
    }
  }

  @Post('ipn')
  @HttpCode(HttpStatus.OK)
  async handleIPN(
    @Body('orderId', ParseIntPipe) orderId: number,
    @Body('transactionId') transactionId: string
  ) {
    return this.ordersService.handlePaymentIPN(orderId, transactionId);
  }

  @Post('cleanup')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async cleanupOrders() {
    const count = await this.ordersService.cleanupExpiredOrders();
    return { success: true, cancelledCount: count };
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
