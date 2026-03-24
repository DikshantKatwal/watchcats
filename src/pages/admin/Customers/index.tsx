import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { columns } from "./columns"
import type { ColumnFiltersState, SortingState } from "@tanstack/react-table"
import { DataTable } from "../../../components/table/main-table"
import { usersApi } from "../../../api/users"



export default function Customer() {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 4,
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    // const { data, isLoading } = useQuery({
    //     queryKey: ["comments", pagination],
    //     queryFn: async () => {
    //         const start = pagination.pageIndex * pagination.pageSize
    //         const limit = pagination.pageSize
    //         const res = await fetch(
    //             `http://localhost:8001/api/v1/admin/users/profiles/?offset=${start}&limit=${limit}`
    //         )

    //         const response: PaginatedResponse<TUser> = await res.json()
    //         const rows = response.result
    //         const total = response.count
    //         return {
    //             rows,
    //             total: total,
    //         }
    //     },

    // })
    const params = {
        limit: String(pagination.pageSize),
        offset: String(pagination.pageIndex * pagination.pageSize),
    };

    const { data, isLoading } = useQuery({
        queryKey: ['users', params],
        queryFn: () => usersApi.list(params),
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    return (
        <div className="container mx-auto py-10">
            <DataTable
                columns={columns}
                data={data?.results ?? []}
                isLoading={isLoading}
                pageCount={Math.ceil((data?.count ?? 0) / pagination.pageSize)}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
                columnFilters={columnFilters}
                setColumnFilters={setColumnFilters}
            />
        </div>
    )
}