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
	SortingState,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import { DataTable } from "../../components/data-table";
import { DataTablePagination } from "../../components/data-table-pagination";
import { Doc } from "./columns";
import { useDocuments } from "@/hooks/documents";
import { Flow } from "@prisma/client";

type DocumentTableProps = {
	title: string;
	columns: ColumnDef<Doc>[];
	flow: Flow;
	data: Doc[] | undefined;
};
export function DocumentTable({ title, columns, data }: DocumentTableProps) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data: data ?? [],
		columns: columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,
		state: {
			sorting,
		},
		enableMultiRowSelection: false,
		enableRowSelection: false,
	});
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>
					Manage your documents and view their log history.
				</CardDescription>
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
