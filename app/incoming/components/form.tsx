"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { ChevronLeft, File, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { UseFormReturn, useForm } from "react-hook-form";
import {
	IncomingDocType,
	incomingDocumentSchema,
} from "@/schema/incoming-document-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatePicker } from "@/components/date-picker";
import { TimePicker } from "@/components/time-picker";
import { Office } from "@prisma/client";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { createOrUpdateIncDocument } from "@/action/documents";
import { useToast } from "@/components/ui/use-toast";
import { fileWrapper } from "@/lib/utils";

export function IncomingForm() {
	const form = useForm<IncomingDocType>({
		resolver: zodResolver(incomingDocumentSchema),
		defaultValues: {
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

	const { toast } = useToast();

	async function onSubmit(values: IncomingDocType) {
		const { files, ...others } = values;
		const filesFD = files ? fileWrapper(files) : null;

		const result = await createOrUpdateIncDocument({
			...others,
			files: filesFD,
		});
		if (result) {
			toast({
				description: "Your document is successfully created.",
			});
		}
		form.reset();
	}

	return (
		<Form {...form}>
			<form
				className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4"
				onSubmit={form.handleSubmit(onSubmit)}>
				<div className="flex items-center gap-4">
					<Button variant="outline" size="icon" className="size-7">
						<ChevronLeft className="h-4 w-4" />
						<span className="sr-only">Back</span>
					</Button>
					<div className="hidden items-center gap-2 md:ml-auto md:flex">
						<Button type="button" variant="outline" size="sm">
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
					<Button type="button" variant="outline" size="sm">
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
								<Input {...field} />
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
	const files = form.watch("files");
	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Attachments</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-2">
				<div className="grid grid-cols-3 gap-2">
					{files &&
						files.map((file, index) => (
							<Tooltip key={index} delayDuration={0}>
								<TooltipTrigger className="border border-dashed p-6 flex items-center justify-center">
									<File className="aspect-square" />
								</TooltipTrigger>
								<TooltipContent>{file.name}</TooltipContent>
							</Tooltip>
						))}
				</div>

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
									className: "flex w-full lg:min-w-60 gap-2",
								})}>
								<Upload className="size-4" />
								<span>Upload</span>
							</FormLabel>
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}
