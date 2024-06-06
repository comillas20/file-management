import { Office } from "@prisma/client";
import z from "zod";
export const incomingDocumentSchema = z.object({
	id: z.string(),
	subject: z.string().min(1, { message: "This is required" }),
	date_received: z.date(),
	eventDate: z.date(),
	sender: z.object({
		name: z.string().min(1, { message: "This is required" }),
		office: z.nativeEnum(Office),
	}),
	signatory: z.string().min(1, { message: "This is required" }).nullable(),
	files: z.instanceof(File, { message: "Invalid file" }).array().nullable(),
	remarks: z.string().nullable(),
});

export type IncomingDocType = z.infer<typeof incomingDocumentSchema>;
