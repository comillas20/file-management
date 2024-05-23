"use client";
import { Office, Prisma, Role } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../../components/data-table-column-header";
import { format, isBefore } from "date-fns";
import { DownloadIcon, Loader2, MoreHorizontalIcon } from "lucide-react";
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
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ReceiverBadge } from "@/components/receiver-badge";
import { formatFileSize } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

type Doc = Prisma.DocumentsGetPayload<{
	include: {
		files: true;
	};
}>;

export type ModDoc = Doc & {
	logs: {
		id: string;
		logDate: string;
		office: Office;
		name: string;
		role: Role;
		documentsId: string;
	}[];
};

export const incDocColumns: ColumnDef<ModDoc>[] = [
	{
		accessorKey: "subject",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Subject" />
		),
	},
	{
		id: "Origin",
		accessorFn: row => row.logs[0].office,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Origin" />
		),
		cell: ({ row }) => (
			<div className="space-x-2">
				<span>{row.original.logs[0].name}</span>
				<span>—</span>
				<span className="font-semibold">
					{row.original.logs[0].office}
				</span>
			</div>
		),
	},
	{
		id: "Date Received",
		accessorFn: row => row.logs[0].logDate,
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
		accessorKey: "files",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Files" />
		),
		cell: ({ row }) => {
			return row.original.files.length > 0 ? (
				<Dialog>
					<DialogTrigger className="text-sm font-semibold text-primary">
						View Files
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Files</DialogTitle>
						</DialogHeader>
						{row.original.files.map(file => (
							<div
								key={file.id}
								className="flex gap-2 justify-between items-center">
								{file.name.concat(
									" — ",
									formatFileSize(file.size)
								)}
								<a
									href={"files/" + file.name}
									className={buttonVariants({
										variant: "outline",
									})}
									download>
									<DownloadIcon className="size-4" />
								</a>
							</div>
						))}
					</DialogContent>
				</Dialog>
			) : (
				<div>No files</div>
			);
		},
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
							<Link
								href={`/incoming/update?doc=${row.original.id}`}>
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

export const outDocColumns: ColumnDef<ModDoc>[] = [
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
		cell: ({ row }) => (
			<Dialog>
				<DialogTrigger className="text-sm font-semibold text-primary">
					View Recipients
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Recipients</DialogTitle>
					</DialogHeader>
					{row.original.logs
						.sort((a, b) =>
							isBefore(a.logDate, b.logDate) ? -1 : 1
						)
						.map(log => (
							<ReceiverBadge
								key={log.id}
								data={{
									name: log.name,
									date_released: log.logDate,
									office: log.office,
								}}
							/>
						))}
				</DialogContent>
			</Dialog>
		),
	},
	{
		id: "Date Released",
		accessorFn: row => row.logs[0].logDate,
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date Released" />
		),
	},
	{
		accessorKey: "purpose",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Purpose" />
		),
	},
	{
		accessorKey: "files",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Files" />
		),
		cell: ({ row }) => {
			return row.original.files.length > 0 ? (
				<Dialog>
					<DialogTrigger className="text-sm font-semibold text-primary">
						View Files
					</DialogTrigger>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Files</DialogTitle>
						</DialogHeader>
						{row.original.files.map(file => (
							<div
								key={file.id}
								className="flex gap-2 justify-between items-center">
								{file.name.concat(
									" — ",
									formatFileSize(file.size)
								)}
								<a
									href={"files/" + file.name}
									className={buttonVariants({
										variant: "outline",
									})}
									download>
									<DownloadIcon className="size-4" />
								</a>
							</div>
						))}
					</DialogContent>
				</Dialog>
			) : (
				<div>No files</div>
			);
		},
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
							<Link
								href={`/outgoing/update?doc=${row.original.id}`}>
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
