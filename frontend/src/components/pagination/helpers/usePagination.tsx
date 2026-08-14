import { AsyncThunk } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from '@store/hooks'
import { AppDispatch, RootState } from '@store/store'
import { WebLarekAPI } from '../../../utils/weblarek-api'
import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface PaginationResult<_, U> {
    data: U[]
    totalPages: number
    currentPage: number
    limit: number
    nextPage: () => void
    prevPage: () => void
    setPage: (page: number) => void
    setLimit: (limit: number) => void
}

interface ThunkConfig {
    extra: WebLarekAPI
    state: RootState
    dispatch: AppDispatch
}

interface PaginationPayload {
    pagination: {
        totalPages: number
    }
}

const usePagination = <T, U>(
    asyncAction: AsyncThunk<T, Record<string, unknown>, ThunkConfig>,
    selector: (state: RootState) => U[],
    defaultLimit: number
): PaginationResult<T, U> => {
    const dispatch = useDispatch()
    const data = useSelector(selector)
    const [searchParams, setSearchParams] = useSearchParams()
    const [totalPages, setTotalPages] = useState<number>(1)

    const currentPage = Math.min(
        Number(searchParams.get('page')) || 1,
        totalPages
    )

    const limit = Number(searchParams.get('limit')) || defaultLimit

    const updateURL = useCallback(
        (newParams: Record<string, unknown>) => {
            const updatedParams = new URLSearchParams(searchParams)
            Object.entries(newParams).forEach(([key, value]) => {
                if (value !== undefined) {
                    updatedParams.set(key, String(value))
                } else {
                    updatedParams.delete(key)
                }
            })
            setSearchParams(updatedParams)
        },
        [searchParams, setSearchParams]
    )

    const setPage = useCallback(
        (page: number) => {
            const newPage = Math.max(1, Math.min(page, totalPages))
            updateURL({ page: newPage, limit })
        },
        [totalPages, limit, updateURL]
    )

    const fetchData = useCallback(
        async (params: Record<string, unknown>) => {
            const response = await dispatch(asyncAction(params))
            const payload = response.payload as PaginationPayload | undefined
            if (payload?.pagination) {
                setTotalPages(payload.pagination.totalPages)
            }
        },
        [dispatch, asyncAction]
    )

    const dataLength = data.length

    useEffect(() => {
        const params = Object.fromEntries(searchParams.entries())
        fetchData({ ...params, page: currentPage, limit }).then(() => {
            if (dataLength === 0 && currentPage > 1) {
                setPage(1)
            }
        })
    }, [currentPage, limit, searchParams, fetchData, dataLength, setPage])

    const nextPage = () => {
        if (currentPage < totalPages) {
            updateURL({ page: currentPage + 1, limit })
        }
    }

    const prevPage = () => {
        if (currentPage > 1) {
            updateURL({ page: currentPage - 1, limit })
        }
    }

    const setLimit = (newLimit: number) => {
        updateURL({ page: 1, limit: newLimit })
    }

    return {
        data,
        totalPages,
        currentPage,
        limit,
        nextPage,
        prevPage,
        setPage,
        setLimit,
    }
}

export default usePagination
