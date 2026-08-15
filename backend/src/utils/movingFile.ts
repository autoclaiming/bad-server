import { existsSync, mkdirSync, renameSync } from 'fs'
import { basename, join, resolve, sep } from 'path'

function movingFile(imagePath: string, from: string, to: string) {
    const fileName = basename(imagePath)

    if (!fileName || fileName === '.' || fileName === '..') {
        throw new Error('Ошибка при сохранении файла')
    }

    const fromDir = resolve(from)
    const toDir = resolve(to)
    const imagePathTemp = resolve(join(fromDir, fileName))
    const imagePathPermanent = resolve(join(toDir, fileName))

    if (
        !imagePathTemp.startsWith(fromDir + sep) ||
        !imagePathPermanent.startsWith(toDir + sep)
    ) {
        throw new Error('Ошибка при сохранении файла')
    }

    mkdirSync(toDir, { recursive: true })

    if (!existsSync(imagePathTemp)) {
        throw new Error('Ошибка при сохранении файла')
    }

    renameSync(imagePathTemp, imagePathPermanent)
}

export default movingFile
