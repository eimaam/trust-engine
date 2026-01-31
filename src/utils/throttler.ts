import Bottleneck from 'bottleneck';

/**
 * manages rate limits for external APIs.
 * ensures we don't exceed the target API's capacity and queues requests.
 */
class ThrottlerService {
    private throttlers: Map<string, Bottleneck> = new Map();

    /**
     * get or create a throttler for a specific service.
     * @param serviceId Unique identifier for the service (e.g., 'cac')
     * @param options Bottleneck configuration options
     */
    getThrottler(serviceId: string, options: Bottleneck.ConstructorOptions): Bottleneck {
        if (!this.throttlers.has(serviceId)) {
            this.throttlers.set(serviceId, new Bottleneck(options));
        }
        return this.throttlers.get(serviceId)!;
    }

    /**
     * Wrap a function with a throttler.
     */
    async wrap<T>(serviceId: string, options: Bottleneck.ConstructorOptions, fn: () => Promise<T>): Promise<T> {
        const throttler = this.getThrottler(serviceId, options);
        return throttler.schedule(fn);
    }
}

export const throttlerService = new ThrottlerService();
