import { Documents, Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../components/data-table-column-header";
import { Button } from "@/components/ui/button";

export type Doc = Prisma.DocumentsGetPayload<{
	include: {
		entity: true;
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
		id: "Office Origin",
		accessorFn: row => row.entity[0].office,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Office Origin" />
		),
	},
	{
		accessorKey: "date_received",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date Received" />
		),
	},
	{
		accessorKey: "signatory",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Signatory" />
		),
	},
	{
		id: "actions",
		cell: ({ row }) => <Button />,
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
		accessorFn: row => row.entity,
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
