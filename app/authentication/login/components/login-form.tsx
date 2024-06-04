"use client";
import Link from "next/link";

import { login } from "@/action/authentication";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Login, loginSchema } from "@/schema/login-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";

export function LoginForm() {
	const form = useForm<Login>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const [message, setMessage] = useState<string>();
	async function onSubmit(values: Login) {
		const result = await login(values);
		if (result) {
			setMessage(result.error);
		}
	}
	return (
		<Card className="mx-auto max-w-sm w-80">
			<CardHeader>
				<CardTitle className="text-2xl">DMS Login</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="grid gap-4">
							<FormField
								control={form.control}
								name="username"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Username</FormLabel>
										<FormControl>
											<Input type="text" {...field} />
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
										<div className="flex items-center">
											<FormLabel>Password</FormLabel>
											{/* <Link
												href="#"
												className="ml-auto inline-block text-sm underline">
												Forgot your password?
											</Link> */}
										</div>
										<FormControl>
											<Input type="password" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit" className="w-full">
								Login
							</Button>
						</div>
						<div className="mt-4 text-center text-sm text-destructive">
							{message}
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
