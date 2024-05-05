"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Account, accountSchema } from "@/schema/account-schema";
import { updateAccount } from "@/action/authentication";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

type AccountFormProps = {
	data: {
		id: string;
		username: string;
	};
};
export function AccountForm({ data }: AccountFormProps) {
	const defaultValues: Partial<Account> = {
		id: data.id,
		username: data.username,
		password: "",
	};
	const form = useForm<Account>({
		resolver: zodResolver(accountSchema),
		defaultValues,
	});
	const router = useRouter();
	async function onSubmit(data: Account) {
		const result = await updateAccount({
			...data,
			newPassword: data.password,
		});
		if (result.error) {
			toast({
				description: result.error,
				variant: "destructive",
			});
		} else {
			toast({
				description: "Account details changed successfully",
			});
		}
		router.refresh();
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input
									placeholder="Atleast 8 characters"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>New Password</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder="Atleast 8 characters"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" disabled={!form.formState.isDirty}>
					Update account
				</Button>
			</form>
		</Form>
	);
}
