import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheHelperService {
  private cache = new Map<string, { value: any, expiry: number | null }>();

  async get<T>(key: string): Promise<T | null | undefined> {
    const item = this.cache.get(key);
    if (!item) return undefined;
    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key);
      return undefined;
    }
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + (ttl * 1000) : null;
    this.cache.set(key, { value, expiry });
  }

  async del(key: string): Promise<void> {
    this.cache.delete(key);
  }

  /**
   * Invalidates cache keys starting with a specific prefix
   */
  async invalidatePattern(prefix: string): Promise<void> {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async reset(): Promise<void> {
    this.clear();
  }
}
