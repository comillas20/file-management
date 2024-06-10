"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	ColumnDef,
	ColumnFiltersState,
	SortingState,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../../components/data-table";
import { DataTablePagination } from "../../components/data-table-pagination";
import { ModDoc } from "./columns";
import { useDocuments } from "@/hooks/documents";
import { Flow } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

type DocumentTableProps = {
	title: string;
	columns: ColumnDef<ModDoc>[];
	flow: Flow;
	data: ModDoc[] | undefined;
};
export function DocumentTable({ title, columns, data }: DocumentTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [globalFilter, setGlobalFilter] = useState<string>("");

	const table = useReactTable({
		data: data ?? [],
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			globalFilter,
		},
		enableMultiRowSelection: false,
		enableRowSelection: false,
	});
	return (
		<Card className="shadow-md">
			<CardHeader className="flex-row gap-4 justify-between">
				<div className="flex flex-col space-y-1.5">
					<CardTitle>{title}</CardTitle>
					<CardDescription>
						Manage your documents and view their log history.
					</CardDescription>
				</div>
				<div className="flex items-center">
					<Input
						type="search"
						className="border-e-0 rounded-e-none z-10"
						value={globalFilter}
						onChange={event => {
							setGlobalFilter(event.target.value);
						}}
						placeholder="Search subject or date"
					/>
					<span className="aspect-square border border-input bg-background h-10 flex items-center justify-center rounded-e-md">
						<Search size={15} />
					</span>
				</div>
			</CardHeader>
			<CardContent>
				<DataTable table={table} columnLength={columns.length} />
			</CardContent>
			<CardFooter>
				<DataTablePagination table={table} />
			</CardFooter>
		</Card>
	);
}
