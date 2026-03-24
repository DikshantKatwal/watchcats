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
import { memo, useState, useCallback } from "react"
import { Skeleton } from "../../components/ui/skeleton"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    isLoading: boolean
    pageCount: number
    pagination: { pageIndex: number; pageSize: number }
    setPagination: React.Dispatch<React.SetStateAction<{ pageIndex: number; pageSize: number }>>
    sorting: SortingState
    setSorting: React.Dispatch<React.SetStateAction<SortingState>>
    columnFilters: ColumnFiltersState
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>
    filterValue: string
    setFilterValue: React.Dispatch<React.SetStateAction<string>>
}

// ── Memoized row — prevents all rows re-rendering when one changes ──────────
const MemoTableRow = memo(
    ({ row }: { row: ReturnType<ReturnType<typeof useReactTable>["getRowModel"]>["rows"][0] }) => (
        <TableRow>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>
    )
)

// ── Skeleton rows — stable, no deps ───────────────────────────────────────
const SkeletonRows = memo(
    ({ pageSize, colCount }: { pageSize: number; colCount: number }) => (
        <>
            {Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                    {Array.from({ length: colCount }).map((_, j) => (
                        <TableCell key={j}>
                            <Skeleton className="h-4 w-full" />
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
)

function DataTableInner<TData, TValue>({
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
    filterValue,
    setFilterValue,
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = useState({})

    const handleSortingChange = useCallback(setSorting, [setSorting])
    const handleFiltersChange = useCallback(setColumnFilters, [setColumnFilters])
    const handlePaginationChange = useCallback(setPagination, [setPagination])
    const handleGlobalFilterChange = useCallback(setFilterValue, [setFilterValue])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        manualFiltering: true,
        manualSorting: true,
        manualPagination: true,
        pageCount,
        onSortingChange: handleSortingChange,
        onColumnFiltersChange: handleFiltersChange,
        onPaginationChange: handlePaginationChange,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: handleGlobalFilterChange,
        state: {
            sorting,
            globalFilter: filterValue,
            columnFilters,
            columnVisibility,
            rowSelection,
            pagination,
        },
    })

    const rows = table.getRowModel().rows

    return (
        <div className="border-1 rounded-lg p-2">
            <MainTableHeader table={table} filterValue={filterValue} />

            <div className="rounded-md ">
                <div className="max-h-100 overflow-y-auto">
                    <Table className="w-full">
                        <TableHeader className="sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
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
                                <SkeletonRows
                                    pageSize={pagination.pageSize}
                                    colCount={columns.length}
                                />
                            ) : rows.length > 0 ? (
                                rows.map((row) => <MemoTableRow key={row.id} row={row} />)
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
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

export const DataTable = memo(DataTableInner) as typeof DataTableInner