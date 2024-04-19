import { Office } from "@prisma/client";
import z from "zod";
export const incomingDocumentSchema = z.object({
	id: z.string(),
	subject: z.string().min(1, { message: "This is required" }),
	date_received: z.date(),
	sender: z.object({
		name: z.string().min(1, { message: "This is required" }),
		office: z.nativeEnum(Office),
	}),
	signatory: z.string().min(1, { message: "This is required" }),
	files: z.instanceof(File).array().nullable(),
});

export type IncomingDocType = z.infer<typeof incomingDocumentSchema>;
