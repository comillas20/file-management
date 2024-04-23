"use client";
import { createOrUpdateOutDocument } from "@/action/documents";
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
	OutgoingDocType,
	outgoingDocumentSchema,
} from "@/schema/outgoing-document-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Purpose } from "@prisma/client";
import { ChevronLeft, PlusIcon, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { UseFormReturn, useForm } from "react-hook-form";
import { ReceiverCard } from "./receiver-card";
import { Doc } from "@/app/components/columns";

type OutgoingFormProps = {
	data?: Doc;
};
export function OutgoingForm({ data }: OutgoingFormProps) {
	const { toast } = useToast();
	const { revalidateDocuments } = useDocuments();

	const form = useForm<OutgoingDocType>({
		resolver: zodResolver(outgoingDocumentSchema),
		defaultValues: data
			? {
					id: data.id,
					subject: data.subject,
					recipient: data.logs.map(log => ({
						...log,
						date_released: log.logDate,
					})),
					purpose: data.purpose,
					files: data.files.map(file => new File([], file.name)),
			  }
			: {
					id: "ambatukam",
					subject: "",
					recipient: [],
					purpose: "INFORMATION",
					files: null,
			  },
	});

	async function onSubmit(values: OutgoingDocType) {
		const { files, ...others } = values;
		const filesFD = files ? fileWrapper(files) : null;

		const result = await createOrUpdateOutDocument({
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
						<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
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
						<Button
							type="submit"
							size="sm"
							disabled={!form.formState.isDirty}>
							Save
						</Button>
					</div>
				</div>
				<div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
					<div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
						<DocumentCard form={form} />
						<ReceiverCard form={form} />
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
					<Button
						type="submit"
						size="sm"
						disabled={!form.formState.isDirty}>
						Save
					</Button>
				</div>
			</form>
		</Form>
	);
}

type Form = {
	form: UseFormReturn<OutgoingDocType>;
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
					name="purpose"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Purpose</FormLabel>
							<FormControl>
								<Select
									value={field.value}
									onValueChange={field.onChange}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{Object.values(Purpose).map(purpose => (
											<SelectItem
												key={purpose}
												value={purpose}>
												{"For " + purpose.toLowerCase()}
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
												className="flex gap-1 group p-2 border rounded-sm items-center"
												onClick={() =>
													field.onChange(
														deleteFileFromArray(
															field.value,
															file
														)
													)
												}>
												<span className="flex-1 text-ellipsis truncate text-xs font-medium">
													{file.name}
												</span>
												<X
													className="group-hover:inline hidden"
													size={15}
												/>
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
