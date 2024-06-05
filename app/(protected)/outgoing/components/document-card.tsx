import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { OutgoingDocType } from "@/schema/outgoing-document-schema";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

type Form = {
	form: UseFormReturn<OutgoingDocType>;
};

enum Purpose {
	Information,
	Signature,
	Others,
}

const OTHERS = "Others";

export function DocumentCard({ form }: Form) {
	const p = form.watch("purpose");
	const [currentPurpose, setCurrentPurpose] = useState(
		Object.keys(Purpose)
			.filter(key => isNaN(Number(key)))
			.includes(p)
			? p
			: OTHERS
	);
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
								<div className="space-y-2">
									<Select
										value={currentPurpose}
										onValueChange={e => {
											setCurrentPurpose(e);
											const isOthers = e === OTHERS;
											if (isOthers) field.onChange("");
											else field.onChange(e);
										}}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{Object.keys(Purpose)
												.filter(key =>
													isNaN(Number(key))
												)
												.map(purpose => (
													<SelectItem
														key={purpose}
														value={purpose.toString()}>
														{purpose}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
									<Input
										type="text"
										className={
											currentPurpose !== OTHERS
												? "hidden"
												: "flex"
										}
										placeholder="Specify..."
										{...field}
									/>
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</CardContent>
		</Card>
	);
}
