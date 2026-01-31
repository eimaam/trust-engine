import { z } from 'zod';

export const CacVerificationSchema = z.object({
    searchTerm: z.string().min(1, 'Search term is required'),
    searchType: z.enum(['RC_NUMBER', 'ALL', 'AV_CODE', 'APPROVED_NAME']).default('ALL'),
});

export type CacVerificationRequest = z.infer<typeof CacVerificationSchema>;

export interface CacCompanyData {
    id: number;
    approvedName: string;
    rcNumber: string;
    companyRegistrationDate: string;
    companyId: number;
    classificationName: string;
    natureOfBusiness: string;
    classificationId: number;
    status: string;
}

export interface CacApiResponse {
    status: number;
    message: string;
    data: CacCompanyData[];
    success: boolean;
}
