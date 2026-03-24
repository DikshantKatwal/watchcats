import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    type SortingState,
    useReactTable,
    type VisibilityState,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table"

import { DataTablePagination } from "../../components/table/pagination"
import { MainTableHeader } from "../../components/table/table-header"
import { useState } from "react"
import { Skeleton } from "../../components/ui/skeleton"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean
    pageCount: number
    pagination: {
        pageIndex: number
        pageSize: number
    }
    setPagination: React.Dispatch<
        React.SetStateAction<{
            pageIndex: number
            pageSize: number
        }>
    >
    sorting: SortingState
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
    columnFilters: ColumnFiltersState
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
}

export function DataTable<TData, TValue>({
    columns,
    data,
    pageCount,
    isLoading,
    pagination,
    setPagination,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        pageCount,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })


    return (
        <div>
            <MainTableHeader table={table} />

            <div className="rounded-md ">
                <div className="max-h-100 overflow-y-auto">
                    <Table className="w-full">
                        {/* ✅ Sticky header */}
                        <TableHeader className="sticky top-0 z-10 ">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id} className="">
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: pagination.pageSize }).map((_, i) => (
                                    <TableRow key={i}>
                                        {columns.map((_, j) => (
                                            <TableCell key={j}>
                                                <Skeleton className="h-4 w-full" />
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : data.length > 0 ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            <DataTablePagination table={table} />
        </div>
    )
}