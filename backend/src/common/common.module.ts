import { Module } from '@nestjs/common';
import { CacheHelperService } from './cache-helper.service';

@Module({
  providers: [CacheHelperService],
  exports: [CacheHelperService],
})
export class CommonModule {}
