import rateLimit from 'express-rate-limit'

export const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.path === '/auth/csrf-token',
    message: { message: 'Слишком много запросов, попробуйте позже' },
})

export const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: { message: 'Слишком много попыток входа, попробуйте позже' },
})

export const uploadLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Слишком много загрузок, попробуйте позже' },
})
