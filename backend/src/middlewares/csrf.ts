import { Request } from 'express'
import { doubleCsrf } from 'csrf-csrf'
import { CSRF_SECRET } from '../config'

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: () => CSRF_SECRET,
    getSessionIdentifier: () => '',
    cookieName: '_csrf',
    cookieOptions: {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
        path: '/',
    },
    size: 64,
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    getCsrfTokenFromRequest: (req: Request) =>
        (req.headers['x-csrf-token'] as string) ??
        (req.headers['X-CSRF-Token'] as string),
})

export { generateCsrfToken, doubleCsrfProtection }
