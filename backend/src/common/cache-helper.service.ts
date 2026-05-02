import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@Injectable()
export class CacheHelperService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

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
      // Fallback: clear all if keys() is not available
      await this.clear();
    }
  }

  async clear(): Promise<void> {
    if (typeof (this.cacheManager as any).clear === 'function') {
      await (this.cacheManager as any).clear();
    } else if (typeof (this.cacheManager as any).reset === 'function') {
      await (this.cacheManager as any).reset();
    } else if ((this.cacheManager as any).store?.reset) {
      await (this.cacheManager as any).store.reset();
    } else if ((this.cacheManager as any).store?.clear) {
      await (this.cacheManager as any).store.clear();
    }
  }

  // Backwards compatibility
  async reset(): Promise<void> {
    return this.clear();
  }
}
