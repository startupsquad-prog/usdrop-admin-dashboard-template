"use client"

import { Table } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DataTableViewOptions } from "./data-table-view-options"
import { DataTableFacetedFilter } from "./data-table-faceted-filter"
import { DataTableViewToggle } from "./data-table-view-toggle"
import { DataTableExportMenu } from "./data-table-export-menu"
import { DataTableDateRangePicker } from "./data-table-date-range-picker"
import { X, UserPlus } from "lucide-react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearchChange: (value: string) => void
  view?: string
  onViewChange?: (view: string) => void
  data?: TData[]
  onAddUser?: () => void
  onDateRangeChange?: (dateRange: { from: Date | undefined; to: Date | undefined }) => void
}

export function DataTableToolbar<TData>({
  table,
  onSearchChange,
  view = "table",
  onViewChange,
  data = [],
  onAddUser,
  onDateRangeChange,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search users..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-8 w-[250px]"
        />
        {table.getColumn("role_id") && (
          <DataTableFacetedFilter
            column={table.getColumn("role_id")}
            title="Role"
            options={[
              { label: "Client", value: "client" },
              { label: "Admin", value: "admin" },
              { label: "Owner", value: "owner" },
            ]}
          />
        )}
        {table.getColumn("plan") && (
          <DataTableFacetedFilter
            column={table.getColumn("plan")}
            title="Plan"
            options={[
              { label: "Free", value: "free" },
              { label: "Pro", value: "pro" },
              { label: "Enterprise", value: "enterprise" },
            ]}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2"
          >
            Reset
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
        {onDateRangeChange && (
          <DataTableDateRangePicker onDateRangeChange={onDateRangeChange} />
        )}
      </div>
      <div className="flex items-center gap-2">
        {onViewChange && (
          <DataTableViewToggle view={view} onViewChange={onViewChange} />
        )}
        <DataTableViewOptions table={table} />
        <DataTableExportMenu data={data} />
        {onAddUser && (
          <Button onClick={onAddUser} size="sm">
            <UserPlus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        )}
      </div>
    </div>
  )
}
