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
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { ReceiverBadge } from "@/components/receiver-badge";
import { formatFileSize } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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
								className="grid gap-2 justify-between items-center grid-cols-6">
								<span className="truncate col-span-5">
									{file.name.concat(
										" — ",
										formatFileSize(file.size)
									)}
								</span>
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
			const receivedLog = row.original.logs[0];
			return (
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<MoreHorizontalIcon className="size-4" />
							<span className="sr-only">Open menu</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-40">
							<DialogTrigger asChild>
								<DropdownMenuItem>View</DropdownMenuItem>
							</DialogTrigger>
							<DropdownMenuItem asChild>
								<Link
									href={`/incoming/update?doc=${row.original.id}`}>
									Edit
								</Link>
							</DropdownMenuItem>
							<DeleteDocument id={row.original.id} />
						</DropdownMenuContent>
					</DropdownMenu>
					<DialogContent>
						<DialogHeader className="space-y-4">
							<DialogTitle>Incoming Document</DialogTitle>
							<div className="flex justify-between items-center space-y-0">
								<div className="flex items-center gap-4">
									<div>
										<h5 className="text-sm font-medium">
											{row.original.logs[0].name}
										</h5>
										<p className="text-xs">
											{"Sender — " +
												row.original.logs[0].office}
										</p>
									</div>
								</div>
								<div className="flex flex-col items-end">
									<h5 className="text-sm">
										{format(receivedLog.logDate, "PPPP")}
									</h5>
									<div className="justify-end text-xs">
										{"Received @ " +
											format(receivedLog.logDate, "p")}
									</div>
								</div>
							</div>
						</DialogHeader>
						<Separator />
						<div className="flex-1 space-y-8">
							<h3 className="font-medium">
								{row.original.subject}
							</h3>
							<div>
								<h4 className="font-medium text-sm">
									{row.original.signatory}
								</h4>
								<p className="font-medium text-xs">Signatory</p>
							</div>
						</div>
						<Separator />
						<div>
							<h5 className="text-sm font-medium">
								{row.original.files.length > 0
									? "Attachments"
									: "No Attachments"}
							</h5>
							{row.original.files.map(file => (
								<div
									key={file.id}
									className="grid gap-2 justify-center items-center grid-cols-6">
									<span className="col-span-5 truncate text-sm">
										{file.name}
									</span>
									<div className="w-full flex items-center justify-center">
										<a
											href={"files/" + file.name}
											className={buttonVariants({
												variant: "outline",
												size: "icon",
											})}
											download>
											<DownloadIcon className="size-4" />
										</a>
									</div>
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>
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
								className="grid gap-2 justify-between items-center grid-cols-6">
								<span className="truncate col-span-5">
									{file.name.concat(
										" — ",
										formatFileSize(file.size)
									)}
								</span>
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
			const firstReleaseLog = row.original.logs[0];
			return (
				<Dialog>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<MoreHorizontalIcon className="size-4" />
							<span className="sr-only">Open menu</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-40">
							<DialogTrigger asChild>
								<DropdownMenuItem>View</DropdownMenuItem>
							</DialogTrigger>
							<DropdownMenuItem asChild>
								<Link
									href={`/outgoing/update?doc=${row.original.id}`}>
									Edit
								</Link>
							</DropdownMenuItem>
							<DeleteDocument id={row.original.id} />
						</DropdownMenuContent>
					</DropdownMenu>
					<DialogContent>
						<DialogHeader className="space-y-4">
							<DialogTitle>Outgoing Document</DialogTitle>
							<div className="flex justify-between items-center space-y-0">
								<div className="flex items-center gap-4">
									<div>
										<h5 className="text-sm font-medium">
											{row.original.purpose}
										</h5>
										<p className="text-xs">Purpose</p>
									</div>
								</div>
								<div className="flex flex-col items-end">
									<h5 className="text-sm">
										{format(
											firstReleaseLog.logDate,
											"PPPP"
										)}
									</h5>
									<div className="justify-end text-xs">
										{"First sent @ " +
											format(
												firstReleaseLog.logDate,
												"p"
											)}
									</div>
								</div>
							</div>
						</DialogHeader>
						<Separator />
						<div className="flex-1 space-y-8">
							<h3 className="font-medium">
								{row.original.subject}
							</h3>
							<div className="space-y-2">
								<p className="font-medium text-sm">
									Recipients
								</p>
								<div className="space-y-1 ml-2">
									{row.original.logs.map(log => (
										<ReceiverBadge
											key={log.id}
											data={{
												...log,
												date_released: format(
													log.logDate,
													"PPPP @ p"
												),
											}}
										/>
									))}
								</div>
							</div>
						</div>
						<Separator />
						<div>
							<h5 className="text-sm font-medium">
								{row.original.files.length > 0
									? "Attachments"
									: "No Attachments"}
							</h5>
							{row.original.files.map(file => (
								<div
									key={file.id}
									className="grid gap-2 justify-center items-center grid-cols-6">
									<span className="col-span-5 truncate text-sm">
										{file.name}
									</span>
									<div className="w-full flex items-center justify-center">
										<a
											href={"files/" + file.name}
											className={buttonVariants({
												variant: "outline",
												size: "icon",
											})}
											download>
											<DownloadIcon className="size-4" />
										</a>
									</div>
								</div>
							))}
						</div>
					</DialogContent>
				</Dialog>
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
