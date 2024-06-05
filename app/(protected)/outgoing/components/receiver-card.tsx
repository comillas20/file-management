"use client";

import { DatePicker } from "@/components/date-picker";
import { ReceiverBadge } from "@/components/receiver-badge";
import { TimePicker } from "@/components/time-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FormField, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { OutgoingDocType } from "@/schema/outgoing-document-schema";
import { Office } from "@prisma/client";
import { format, isBefore } from "date-fns";
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import {
	UseFieldArrayReturn,
	UseFormReturn,
	useFieldArray,
} from "react-hook-form";

type Form = {
	form: UseFormReturn<OutgoingDocType>;
};
export function ReceiverCard({ form }: Form) {
	const recipients = useFieldArray({
		control: form.control,
		name: "recipient",
	});

	return (
		<Card>
			<CardHeader>
				<CardTitle>Receiver/s</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-8">
				{recipients.fields
					.sort((a, b) =>
						isBefore(a.date_released, b.date_released) ? -1 : 1
					)
					.map((field, index) => (
						<div
							key={field.id}
							className="flex gap-2 items-center group">
							<ReceiverBadge
								data={{
									...field,
									date_released: format(
										field.date_released,
										"PPP p"
									),
								}}
								className="flex-1"
							/>
							<RecipientDialog
								recipients={recipients}
								data={{ ...field, index }}>
								<Button
									type="button"
									variant="outline"
									size="icon"
									className="hidden group-hover:inline-flex">
									<PencilIcon className="size-4" />
								</Button>
							</RecipientDialog>

							<Button
								type="button"
								variant="outline"
								size="icon"
								className="hidden group-hover:inline-flex"
								onClick={() => recipients.remove(index)}>
								<Trash2Icon className="size-4" />
							</Button>
						</div>
					))}
				<FormField
					control={form.control}
					name="recipient"
					render={() => <FormMessage />}
				/>
				<RecipientDialog recipients={recipients}>
					<Button className="flex justify-center items-center">
						<PlusIcon className="size-4" />
					</Button>
				</RecipientDialog>
			</CardContent>
		</Card>
	);
}

type Recipient = {
	name: string;
	office: Office;
	date_released: Date;
};
type RecipientDialogProps = {
	recipients: UseFieldArrayReturn<OutgoingDocType, "recipient", "id">;
	children: React.ReactNode;
	data?: Recipient & { index: number };
};
function RecipientDialog({ recipients, children, data }: RecipientDialogProps) {
	const defaultRecipient: Recipient = data ?? {
		name: "",
		date_released: new Date(),
		office: "Others",
	};
	const [recipient, setRecipient] = useState<Recipient>(defaultRecipient);

	const onSaveHandler = () => {
		if (recipient.name.trim() === "") return;

		if (data) recipients.update(data.index, recipient);
		else recipients.append(recipient);
		// reset
		reset();
	};
	const reset = () => {
		setRecipient(defaultRecipient);
	};
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent>
				<div className="space-y-2">
					<Label htmlFor="recipient_name">Name</Label>
					<Input
						id="recipient_name"
						value={recipient.name}
						onChange={({ target }) =>
							setRecipient(prev => ({
								name: target.value,
								date_released: prev.date_released,
								office: prev.office,
							}))
						}
					/>
				</div>
				<div className="space-y-2">
					<Label>Date forwarded</Label>
					<div className="flex gap-2">
						<DatePicker
							date={recipient.date_released}
							onDateChange={date =>
								setRecipient(prev => ({
									name: prev.name,
									date_released: date ?? new Date(),
									office: prev.office,
								}))
							}
							className="flex-1"
						/>
						<TimePicker
							time={recipient.date_released}
							onTimeChange={time =>
								setRecipient(prev => ({
									name: prev.name,
									date_released: time ?? new Date(),
									office: prev.office,
								}))
							}
							className="w-auto"
						/>
					</div>
				</div>
				<div className="space-y-2">
					<Label>Office</Label>
					<Select
						value={recipient.office}
						onValueChange={office =>
							setRecipient(prev => ({
								name: prev.name,
								date_released: prev.date_released,
								office: office as Office,
							}))
						}>
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
				</div>
				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" onClick={reset}>
							Cancel
						</Button>
					</DialogClose>

					<DialogClose asChild>
						<Button type="button" onClick={onSaveHandler}>
							{data ? "Update" : "Add"}
						</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
