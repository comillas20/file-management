import { isUsernameTaken } from "@/action/authentication";
import { z } from "zod";

export const accountSchema = z
	.object({
		id: z.string(),
		username: z
			.string()
			// either value is empty (no modification) or value have more than or equal 8 characters (modifying)
			.refine(value => value.length === 0 || value.length >= 8, {
				message: "Username must have atleast 8 characters",
			})
			.optional(),
		password: z
			.string()
			// either value is empty (no modification) or value have more than or equal 8 characters (modifying)
			.refine(value => value.length === 0 || value.length >= 8, {
				message: "Password must have atleast 8 characters",
			})
			.optional(),
	})
	.refine(
		async value =>
			value.username
				? !(await isUsernameTaken({
						...value,
						username: value.username,
				  }))
				: true,
		{
			message: "Username is already taken",
			path: ["username"],
		}
	);

export type Account = z.infer<typeof accountSchema>;
