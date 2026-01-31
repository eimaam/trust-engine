import axios, { AxiosError } from 'axios';
import { CacApiResponse, CacVerificationRequest } from '../schemas/cac.schema';
import { cacheService } from '../utils/cache';
import { throttlerService } from '../utils/throttler';

class CacService {
    private readonly baseUrl = 'CAC_API_URL_REMOVED';

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
            const response = await axios.post<CacApiResponse>(
                this.baseUrl,
                {
                    SearchType: params.searchType,
                    searchTerm: params.searchTerm,
                },
                {
                    headers: {
                        'Accept': '*/*',
                        'Accept-Language': 'en-NG,en-US;q=0.9,en;q=0.8,ar-SA;q=0.7,ar;q=0.6',
                        'Connection': 'keep-alive',
                        'Content-Type': 'application/json',
                        'Origin': 'CAC_ORIGIN_REMOVED',
                        'Referer': 'CAC_ORIGIN_REMOVED/public-search',
                        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
                    },
                }
            );

            cacheService.set(cacheKey, response.data, 86400); // cache for 24 hrs
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 429 && retryCount < 3) {
                console.warn(`Rate limit hit (429). Retrying in 60s... (Attempt ${retryCount + 1}/3)`);
                await new Promise(resolve => setTimeout(resolve, 60000));
                return this.performSearch(params, cacheKey, retryCount + 1);
            }

            console.error('CAC API Error:', error);
            throw new Error('Failed to verify business with CAC');
        }
    }
}

export const cacService = new CacService();
