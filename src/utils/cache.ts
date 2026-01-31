class CacheService {
    private cache: Map<string, { data: any, expiry: number }> = new Map();

    set(
        key: string, 
        data: any, 
        ttlSeconds: number = 3600 // 1 hour
    ) {
        const expiry = Date.now() + ttlSeconds * 1000;
        this.cache.set(key, { data, expiry });
    }

    get(key: string) {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() > entry.expiry) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }

    delete(key: string) {
        this.cache.delete(key);
    }

    clear() {
        this.cache.clear();
    }
}

export const cacheService = new CacheService();
