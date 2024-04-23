import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(8, "Username must be atleast 8 characters"),
	password: z
		.string()
		.min(8, { message: "Password must be 8 characters long" }),
});

export type Login = z.infer<typeof loginSchema>;
