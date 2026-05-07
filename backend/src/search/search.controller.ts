import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { JwtAuthGuard, RolesGuard } from '../infrastructure/auth/jwt-auth.guard';
import { Roles } from '../infrastructure/auth/roles.decorator';
import { UserRole } from '../common/constants/user-role.enum';
import { User } from '../users/entities/user.entity';
import { Order } from '../orders/entities/order.entity';
import { Blog } from '../blogs/entities/blog.entity';

@Controller('search')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.STAFF)
export class SearchController {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
  ) {}

  @Get()
  async search(@Query('q') q = '') {
    const term = q.trim();
    if (term.length < 2) {
      return { users: [], orders: [], blogs: [] };
    }

    const like = `%${term}%`;
    const [users, orders, blogs] = await Promise.all([
      this.userRepository.find({
        where: [{ fullName: Like(like) }, { email: Like(like) }],
        take: 5,
      }),
      this.orderRepository.find({
        where: [{ receiverName: Like(like) }, { phone: Like(like) }],
        order: { createdAt: 'DESC' },
        take: 5,
      }),
      this.blogRepository.createQueryBuilder('blog')
        .leftJoinAndSelect('blog.author', 'author')
        .where('blog.title LIKE :like', { like })
        .orWhere('author.fullName LIKE :like', { like })
        .orderBy('blog.createdAt', 'DESC')
        .take(5)
        .getMany(),
    ]);

    return {
      users: users.map((user) => ({
        id: user.id,
        title: user.fullName,
        subtitle: user.email,
        path: `/admin/users/${user.id}`,
      })),
      orders: orders.map((order) => ({
        id: order.id,
        title: `Order #${order.id}`,
        subtitle: `${order.receiverName} - ${order.status}`,
        path: `/admin/orders/${order.id}`,
      })),
      blogs: blogs.map((blog) => ({
        id: blog.id,
        title: blog.title,
        subtitle: blog.author?.fullName || 'Unknown author',
        path: `/vi/blog/${blog.id}`,
      })),
    };
  }
}
