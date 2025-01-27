import { Office } from "@prisma/client";
import z from "zod";
export const outgoingDocumentSchema = z.object({
	id: z.string(),
	subject: z.string().min(1, { message: "This is required" }),
	recipient: z
		.object({
			name: z.string().min(1, { message: "This is required" }),
			office: z.nativeEnum(Office),
			date_released: z.date(),
		})
		.array()
		.min(1, { message: "Provide atleast one receiver" }),
	eventDate: z.date(),
	purpose: z.string().min(1, { message: "This is required" }),
	files: z.instanceof(File, { message: "Invalid File" }).array().nullable(),
	remarks: z.string().nullable(),
});

export type OutgoingDocType = z.infer<typeof outgoingDocumentSchema>;
