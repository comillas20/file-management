import { Office } from "@prisma/client";
import z from "zod";
export const incomingDocumentSchema = z.object({
	subject: z.string().min(1, { message: "This is required" }),
	date_received: z.date(),
	sender: z.object({
		name: z.string(),
		office: z.nativeEnum(Office),
	}),
	signatory: z.string(),
	files: z.instanceof(File).array(),
});

export type IncomingDocType = z.infer<typeof incomingDocumentSchema>;
