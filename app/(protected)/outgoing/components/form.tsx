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
import { useToast } from "@/components/ui/use-toast";
import { useDocuments } from "@/hooks/documents";
import { fileWrapper } from "@/lib/utils";
import {
	OutgoingDocType,
	outgoingDocumentSchema,
} from "@/schema/outgoing-document-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import { ChevronLeft, PlusIcon, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { UseFormReturn, useForm } from "react-hook-form";
import { ReceiverCard } from "./receiver-card";
import { DocumentCard } from "./document-card";
import { Textarea } from "@/components/ui/textarea";

type OutgoingFormProps = {
	data?: Prisma.DocumentsGetPayload<{
		include: {
			logs: true;
			files: true;
		};
	}>;
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
					remarks: data.remarks,
			  }
			: {
					id: "ambatukam",
					subject: "",
					recipient: [],
					purpose: "Information",
					files: null,
					remarks: null,
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
						<RemarksCard form={form} />
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

function FileUploadCard({ form }: Form) {
	const deleteFileFromArray = (array: File[] | null, fileToRemove: File) => {
		if (array === null) return;
		return array.filter(arr => arr.name !== fileToRemove.name);
	};

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle className="text-lg">Attachments</CardTitle>
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

function RemarksCard({ form }: Form) {
	return (
		<Card>
			<FormField
				control={form.control}
				name="remarks"
				render={({ field }) => (
					<FormItem>
						<CardHeader>
							<FormLabel className="font-semibold leading-none tracking-tight text-lg">
								Remarks
							</FormLabel>
						</CardHeader>
						<CardContent>
							<FormControl>
								<Textarea
									{...field}
									value={field.value ?? ""}
								/>
							</FormControl>
						</CardContent>
					</FormItem>
				)}
			/>
		</Card>
	);
}
