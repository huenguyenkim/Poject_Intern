import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheHelperService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  /**
   * Invalidates cache keys starting with a specific prefix
   * Note: In-memory store allows iterating through keys.
   */
  async invalidatePattern(prefix: string): Promise<void> {
    const store = (this.cacheManager as any).store;
    
    // Check if the store has a keys method (standard for memory store)
    if (store && typeof store.keys === 'function') {
      const keys = await store.keys();
      const filteredKeys = keys.filter((key: string) => key.startsWith(prefix));
      
      for (const key of filteredKeys) {
        await this.cacheManager.del(key);
      }
    } else {
      // Fallback: reset all if keys() is not available
      await this.reset();
    }
  }

  async reset(): Promise<void> {
    if (typeof this.cacheManager.reset === 'function') {
      await this.cacheManager.reset();
    } else if ((this.cacheManager as any).store?.reset) {
      await (this.cacheManager as any).store.reset();
    } else if (typeof (this.cacheManager as any).clear === 'function') {
      await (this.cacheManager as any).clear();
    }
  }
}
