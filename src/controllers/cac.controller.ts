import { Context } from 'hono';
import { cacService } from '../services/cac.service';
import { CacVerificationSchema } from '../schemas/cac.schema';
import { catchAsync } from '../utils/catchAsAsync';
import { sendSuccess } from '../utils/responseHandler';

export const verifyCac = catchAsync(async (c: Context) => {
    const body = await c.req.json();
    const validatedData = CacVerificationSchema.parse(body);

    const result = await cacService.verify(validatedData);

    return sendSuccess({
        c,
        message: 'Verification successful',
        data: result.data,
    });
});
