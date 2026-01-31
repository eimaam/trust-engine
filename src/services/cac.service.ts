import { CacApiResponse, CacVerificationRequest } from '../schemas/cac.schema';
import { cacheService } from '../utils/cache';
import { throttlerService } from '../utils/throttler';
import { config } from '../config/env';

class CacService {

    /**
     * throttler configuration:
     * - minTime: 3000ms (at most one request every 3 seconds to stay under 20 req/min) // cac endpoint allows estimatedly 20 req per min right now or sort of... testing test...
     * - maxConcurrent: 1 (process sequentially to be safe)
     */
    private readonly throttlerOptions = {
        minTime: 3000,
        maxConcurrent: 1,
    };

    async verify(params: CacVerificationRequest): Promise<CacApiResponse> {
        const cacheKey = `cac:${params.searchType}:${params.searchTerm}`;
        const cachedData = cacheService.get(cacheKey);

        if (cachedData) {
            console.log(`Cache hit for ${cacheKey}`);
            return cachedData;
        }

        return throttlerService.wrap('cac', this.throttlerOptions, () => this.performSearch(params, cacheKey));
    }

    private async performSearch(params: CacVerificationRequest, cacheKey: string, retryCount = 0): Promise<CacApiResponse> {
        try {
            const response = await fetch(config.CAC_API_URL, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Accept-Language': 'en-NG,en-US;q=0.9,en;q=0.8,ar-SA;q=0.7,ar;q=0.6',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/json',
                    'Origin': config.CAC_ORIGIN,
                    'Referer': config.CAC_REFERER,
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
                },
                body: JSON.stringify({
                    SearchType: params.searchType,
                    searchTerm: params.searchTerm,
                }),
            });

            if (response.status === 429 && retryCount < 3) {
                console.warn(`Rate limit hit (429). Retrying in 60s... (Attempt ${retryCount + 1}/3)`);
                await new Promise(resolve => setTimeout(resolve, 60000)); // 1min delay before retry...
                return this.performSearch(params, cacheKey, retryCount + 1);
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('CAC API Error Response:', errorText);
                throw new Error(`CAC API returned status ${response.status}`);
            }

            const data = (await response.json()) as CacApiResponse;
            cacheService.set(cacheKey, data, 86400); // cache for 24 hrs
            return data;
        } catch (error) {
            console.error('CAC API Error:', error);
            throw new Error('Failed to verify business with CAC');
        }
    }
}

export const cacService = new CacService();
