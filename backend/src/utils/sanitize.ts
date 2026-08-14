import sanitizeHtml from 'sanitize-html'

export default function sanitizeText(value: unknown): string {
    if (typeof value !== 'string') {
        return ''
    }

    return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
        disallowedTagsMode: 'recursiveEscape',
    }).trim()
}
