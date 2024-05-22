"use client";
import { createOrUpdateIncDocument } from "@/action/documents";
import { Doc } from "@/app/components/columns";
import { DatePicker } from "@/components/date-picker";
import { TimePicker } from "@/components/time-picker";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useDocuments } from "@/hooks/documents";
import { fileWrapper } from "@/lib/utils";
import {
	IncomingDocType,
	incomingDocumentSchema,
} from "@/schema/incoming-document-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Office } from "@prisma/client";
import { ChevronLeft, PlusIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseFormReturn, useForm } from "react-hook-form";

type IncomingFormProps = {
	data?: Doc;
};
export function IncomingForm({ data }: IncomingFormProps) {
	const { toast } = useToast();
	const { revalidateDocuments } = useDocuments();

	const form = useForm<IncomingDocType>({
		resolver: zodResolver(incomingDocumentSchema),
		defaultValues: data
			? {
					id: data.id,
					subject: data.subject,
					sender: {
						name: data.logs[0].name,
						office: data.logs[0].office,
					},
					signatory: data.signatory,
					date_received: data.logs[0].logDate,
					files: data.files.map(file => new File([], file.name)),
			  }
			: {
					id: "ambatukam",
					subject: "",
					sender: {
						name: "",
						office: "Others",
					},
					signatory: "",
					date_received: new Date(),
					files: null,
			  },
	});

	async function onSubmit(values: IncomingDocType) {
		const { files, ...others } = values;
		const filesFD = files ? fileWrapper(files) : null;

		const result = await createOrUpdateIncDocument({
			...others,
			files: filesFD,
		});
		if (result) {
			toast({
				description: data
					? "Your document is successfully updated."
					: "Your document is successfully created.",
			});
		}
		revalidateDocuments();
		if (!data) form.reset();
	}

	const router = useRouter();

	return (
		<Form {...form}>
			<form
				className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex items-center gap-4">
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="size-7"
						onClick={() => router.back()}>
						<ChevronLeft className="size-4" />
						<span className="sr-only">Back</span>
					</Button>
					{data && (
						<h1 className="flex-1 whitespace-nowrap text-xl font-semibold tracking-tight text-ellipsis overflow-hidden max-w-80">
							{data.subject}
						</h1>
					)}
					<div className="hidden items-center gap-2 md:ml-auto md:flex">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => form.reset()}>
							Discard
						</Button>
						<Button type="submit" size="sm">
							Save
						</Button>
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
					<div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
						<DocumentCard form={form} />
						<SenderCard form={form} />
					</div>
					<div className="grid auto-rows-max items-start gap-4 lg:gap-8">
						<FileUploadCard form={form} />
					</div>
				</div>
				<div className="flex items-center justify-center gap-2 md:hidden">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => form.reset()}>
						Discard
					</Button>
					<Button type="submit" size="sm">
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
}

type Form = {
	form: UseFormReturn<IncomingDocType>;
};

function DocumentCard({ form }: Form) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Document</CardTitle>
			</CardHeader>
			<CardContent className="space-y-8">
				<FormField
					control={form.control}
					name="subject"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Subject</FormLabel>
							<FormControl>
								<Textarea {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="date_received"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Date Received</FormLabel>
							<FormControl>
								<div className="flex gap-2">
									<DatePicker
										date={field.value}
										onDateChange={field.onChange}
										className="flex-1"
									/>
									<TimePicker
										time={field.value}
										onTimeChange={field.onChange}
										className="w-auto"
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="signatory"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Signatory</FormLabel>
							<FormControl>
								<Input {...field} value={field.value ?? ""} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}

function SenderCard({ form }: Form) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>Sender</CardTitle>
			</CardHeader>
			<CardContent className="space-y-8">
				<FormField
					control={form.control}
					name="sender.name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="sender.office"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Office</FormLabel>
							<FormControl>
								<Select
									value={field.value}
									onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.values(Office).map(o => (
											<SelectItem key={o} value={o}>
												{o}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}

function FileUploadCard({ form }: Form) {
	const deleteFileFromArray = (array: File[] | null, fileToRemove: File) => {
		if (array === null) return;
		return array.filter(arr => arr.name !== fileToRemove.name);
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Attachments</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				<FormField
					control={form.control}
					name="files"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<div className="space-y-2">
									{field.value &&
										field.value.map((file, index) => (
											<div
												key={index}
												className="flex gap-1 group border rounded-sm items-center cursor-pointer"
												onClick={() =>
													field.onChange(
														deleteFileFromArray(
															field.value,
															file
														)
													)
												}>
												<span className="flex-1 text-ellipsis truncate text-xs font-medium p-2">
													{file.name}
												</span>
												<button className="group/button justify-center items-center aspect-square group-hover:flex hidden p-2 rounded-e-sm hover:bg-destructive">
													<X
														className="group-hover/button:text-destructive-foreground"
														size={15}
													/>
												</button>
											</div>
										))}
								</div>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="files"
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<input
									type="file"
									className="hidden"
									hidden
									multiple
									onChange={({ target }) => {
										if (
											target.files &&
											target.files.length > 0
										) {
											const files: File[] = Array.from(
												target.files
											);
											if (field.value)
												field.onChange(
													field.value.concat(files)
												);
											else field.onChange(files);
										}
									}}
								/>
							</FormControl>
							<FormLabel
								className={buttonVariants({
									className: "flex w-full lg:min-w-60",
								})}>
								<PlusIcon className="size-4" />
							</FormLabel>
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}
