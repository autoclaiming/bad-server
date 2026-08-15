export type FilterOption = { value: string | number; title?: string }

export type FilterValue = string | number | Date | FilterOption | undefined

export function getFilterValue(value: FilterValue): string | number {
    if (value === undefined) {
        return ''
    }
    if (value instanceof Date) {
        return value.toISOString()
    }
    if (typeof value === 'object') {
        return value.value
    }
    return value
}
