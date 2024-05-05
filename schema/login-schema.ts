import { z } from "zod";

export const loginSchema = z.object({
	username: z.string().min(8, "Username must be atleast 8 characters"),
	password: z.string(),
});

export type Login = z.infer<typeof loginSchema>;
