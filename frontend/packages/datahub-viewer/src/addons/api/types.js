// Copyright (c) 2025 NTT InfraNet
// @flow

export type ErrorResult = {
  statusCode: number,
  error: string,
  message: string,
  messageCode?: string
}

export type DatahubAPIError = {
  originalError: ErrorResult
}

export type ItemResult<T> = {
  statusCode: number,
  data: T
}

export type ListResult<T> = {
  statusCode: number,
  data: {
    current: string,
    next: string | null,
    prev: string | null,
    totalItems: number,
    limit: number,
    offset: number,
    totalPages: 2,
    page: number,
    items: [T]
  }
}
