import { NextFunction, Request, Response } from 'express'
import fs from 'fs'
import path from 'path'

export default function serveStatic(
    baseDir: string,
    options: { maxAge?: string } = {}
) {
    const root = path.resolve(baseDir)
    const { maxAge = '7d' } = options

    return (req: Request, res: Response, next: NextFunction) => {
        let decodedPath: string

        try {
            decodedPath = decodeURIComponent(req.path)
        } catch {
            return next()
        }

        if (decodedPath.includes('\0')) {
            return next()
        }

        const normalized = path
            .normalize(decodedPath)
            .replace(/^(\.\.(\/|\\|$))+/, '')
        const filePath = path.resolve(root, `.${path.sep}${normalized}`)

        if (filePath !== root && !filePath.startsWith(root + path.sep)) {
            return next()
        }

        return fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                return next()
            }

            return res.sendFile(filePath, { maxAge }, (sendErr) => {
                if (sendErr) {
                    next(sendErr)
                }
            })
        })
    }
}
