"use client";

import { flexRender, Table as T } from "@tanstack/react-table";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type DataTableProps<TData> = {
	table: T<TData>;
	columnLength: number;
};

export function DataTable<TData>({
	table,
	columnLength,
}: DataTableProps<TData>) {
	return (
		<Table>
			<TableHeader>
				{table.getHeaderGroups().map(headerGroup => (
					<TableRow key={headerGroup.id}>
						{headerGroup.headers.map(header => {
							return (
								<TableHead key={header.id}>
									{header.isPlaceholder
										? null
										: flexRender(
												header.column.columnDef.header,
												header.getContext()
										  )}
								</TableHead>
							);
						})}
					</TableRow>
				))}
			</TableHeader>
			<TableBody>
				{table.getRowModel().rows?.length ? (
					table.getRowModel().rows.map(row => (
						<TableRow
							key={row.id}
							data-state={row.getIsSelected() && "selected"}
							className="data-[state=selected]:bg-primary data-[state=selected]:text-primary-foreground"
							onClick={() => row.toggleSelected()}>
							{row.getVisibleCells().map(cell => (
								<TableCell
									key={cell.id}
									className="truncate md:max-w-20 lg:max-w-40 xl:max-w-60">
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
							colSpan={columnLength}
							className="h-24 text-center">
							No data.
						</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
}
