import { Documents, Prisma } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../components/data-table-column-header";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Loader2, MoreHorizontalIcon } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { deleteDocuments } from "@/action/documents";
import { useTransition } from "react";
import { useDocuments } from "@/hooks/documents";
import { toast } from "@/components/ui/use-toast";

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
		cell: ({ row }) => {
			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<MoreHorizontalIcon className="size-4" />
						<span className="sr-only">Open menu</span>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-40">
						<DropdownMenuItem asChild>
							<Link href={`/incoming?doc=${row.original.id}`}>
								Edit
							</Link>
						</DropdownMenuItem>
						<DeleteDocument id={row.original.id} />
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
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

function DeleteDocument({ id }: { id: string }) {
	const [deleting, startDeleting] = useTransition();
	const { revalidateDocuments } = useDocuments();

	const handler = () => {
		startDeleting(async () => {
			await deleteDocuments(id);
			revalidateDocuments();
			toast({
				description: "Your document is successfully deleted.",
			});
		});
	};
	return (
		<DropdownMenuItem
			onSelect={handler}
			disabled={deleting}
			className="space-x-2">
			{deleting && <Loader2 className="animate-spin" />}
			<span>Delete</span>
		</DropdownMenuItem>
	);
}
