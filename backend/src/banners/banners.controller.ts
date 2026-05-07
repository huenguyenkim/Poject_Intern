import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { BannersService } from './banners.service';
import { Banner, BannerPosition } from './entities/banner.entity';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findAll(
    @Query('position') position?: BannerPosition,
    @Query('activeOnly') activeOnly?: string,
  ) {
    return this.bannersService.findAll({ 
      position, 
      activeOnly: activeOnly === 'true' 
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<Banner>) {
    return this.bannersService.create(data);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() data: Partial<Banner>) {
    return this.bannersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.remove(id);
  }

  // Analytics Endpoints
  @Post(':id/impression')
  trackImpression(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.trackImpression(id);
  }

  @Post(':id/click')
  trackClick(@Param('id', ParseIntPipe) id: number) {
    return this.bannersService.trackClick(id);
  }
}
