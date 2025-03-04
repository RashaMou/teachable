type CacheValue<T> = {
  data: T;
  expiresAt: number;
};

export class SimpleCache<K, T> {
  private cache = new Map<K, CacheValue<T>>();
  private ttl: number;

  constructor(ttl: number = 5 * 60 * 1000) {
    this.ttl = ttl;
  }

  get(key: K): T | undefined {
    const entry = this.cache.get(key);
    if (!entry) return undefined;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.data;
  }

  set(key: K, data: T): void {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, { data, expiresAt });
  }
}
