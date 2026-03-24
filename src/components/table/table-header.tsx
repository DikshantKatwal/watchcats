import { memo, useState, useEffect } from "react"
import type { Table } from "@tanstack/react-table"
import { Button } from "../ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Input } from "../ui/input"
import { useDebouncedValue } from "@/hooks/useDebounceValue"
import { FieldInput } from "../form/FieldInput"
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group"
import { Search } from "lucide-react"

interface MainTableHeaderProps<TData> {
    table: Table<TData>
    filterValue: string
}

// Inner component — memo'd so it only re-renders when table ref or filterValue changes
function MainTableHeaderInner<TData>({ table, filterValue }: MainTableHeaderProps<TData>) {
    // Local state so the input feels instant (no lag while typing)
    const [inputValue, setInputValue] = useState(filterValue)

    // Sync if parent resets the filter externally (e.g. clear button)
    useEffect(() => {
        setInputValue(filterValue)
    }, [filterValue])

    // Only propagate to table (and trigger re-fetch) after user stops typing
    const debounced = useDebouncedValue(inputValue, 300)

    useEffect(() => {
        table.setGlobalFilter(debounced)
    }, [debounced, table])

    return (
        <div className="flex items-center py-4">
            {/* <Input
                placeholder="Filter..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="max-w-sm"
            /> */}
            <InputGroup
                id={"search"}
                unstyled
                className={"max-w-xs rounded-sm aria-invalid:ring-0 outline-none focus:outline-none focus-visible:ring-0 focus:border-transparent invalid:ring-0"}
            >
                <InputGroupInput
                    id={"search"}
                    type={'text'}
                    placeholder={"search"}
                    className="p-1"
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                />
                <InputGroupAddon
                    align="inline-start"
                    className=""
                >
                    {<Search size={16} />}
                </InputGroupAddon>
            </InputGroup>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                        Columns
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    {table
                        .getAllColumns()
                        .filter((col) => col.getCanHide())
                        .map((col) => (
                            <DropdownMenuCheckboxItem
                                key={col.id}
                                className="capitalize"
                                checked={col.getIsVisible()}
                                onCheckedChange={(value) => col.toggleVisibility(!!value)}
                            >
                                {col.id}
                            </DropdownMenuCheckboxItem>
                        ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

// memo only works on concrete types — wrap with a typed function
export const MainTableHeader = memo(MainTableHeaderInner) as typeof MainTableHeaderInner