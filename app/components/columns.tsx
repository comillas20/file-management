import { Documents, Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MoreHorizontal } from "lucide-react";

export type Doc = Prisma.DocumentsGetPayload<{
	include: {
		logs: true;
		files: true;
	};
}>;

// export const allDocColumns: ColumnDef<Doc>[] = [
// 	{
// 		accessorKey: "subject",
// 		header: ({ column }) => (
// 			<DataTableColumnHeader column={column} title="Subject" />
// 		),
// 	},
// 	{
// 		accessorKey: "flow",
// 		header: ({ column }) => (
// 			<DataTableColumnHeader column={column} title="Incoming/Outgoing" />
// 		),
// 	},
// 	{
// 		accessorKey: "date_released",
// 		header: ({ column }) => (
// 			<DataTableColumnHeader column={column} title="Date Released" />
// 		),
// 	},
// 	{
// 		accessorKey: "date_received",
// 		header: ({ column }) => (
// 			<DataTableColumnHeader column={column} title="Date Received" />
// 		),
// 	},
// 	{
// 		id: "actions",
// 		cell: ({ row }) => <Button />,
// 	},
// ];

export const incDocColumns: ColumnDef<Doc>[] = [
	{
		accessorKey: "subject",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Subject" />
		),
	},
	{
		id: "Office",
		accessorFn: row => row.logs[0].office,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Office" />
		),
	},
	{
		id: "Date Received",
		accessorFn: row => row.logs[0].logDate,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date Received" />
		),
		cell: ({ row }) => format(row.original.logs[0].logDate, "P p"),
	},
	{
		accessorKey: "signatory",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Signatory" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => (
			<Button variant="ghost" className="size-8 p-0">
				<span className="sr-only">Open menu</span>
				<MoreHorizontal className="size-4" />
			</Button>
		),
	},
];

export const outDocColumns: ColumnDef<Doc>[] = [
	{
		accessorKey: "subject",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Subject" />
		),
	},
	{
		id: "Recipients",
		accessorFn: row => row.logs,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Recipients" />
		),
		cell: ({ row }) => <Button variant="link" />,
	},
	{
		accessorKey: "date_released",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date Released" />
		),
	},
	{
		accessorKey: "date_received",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date Received" />
		),
	},
	{
		accessorKey: "purpose",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Purpose" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <Button />,
	},
];
