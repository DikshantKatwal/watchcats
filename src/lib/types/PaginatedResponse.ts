
export type PaginatedResponse<DataType> = {
    count: number
    next: string
    previous: string
    results: DataType[]
}
