"use server";

import prisma from "@/lib/db";
import { fileUnwrapper } from "@/lib/utils";
import { Office } from "@prisma/client";
import { mkdir, readdir, writeFile } from "fs/promises";
import { join } from "path";

type IncDocument = {
	id: string;
	subject: string;
	date_received: Date;
	sender: {
		name: string;
		office: Office;
	};
	signatory: string;
	files: FormData | null;
};

export async function createOrUpdateIncDocument(values: IncDocument) {
	const files = values.files ? fileUnwrapper(values.files) : null;
	if (files) saveFiles(files);

	const newDoc = await prisma.documents.upsert({
		create: {
			subject: values.subject,
			purpose: "INFORMATION",
			signatory: values.signatory,
			flow: "INCOMING",
			logs: {
				create: {
					logDate: values.date_received,
					name: values.sender.name,
					office: values.sender.office,
					role: "SENDER",
				},
			},
			files: files
				? {
						createMany: {
							data: files.map(file => ({
								name: file.name,
								size: file.size,
							})),
						},
				  }
				: undefined,
		},
		where: {
			id: values.id,
		},
		update: {
			subject: values.subject,
			purpose: "INFORMATION",
			signatory: values.signatory,
			flow: "INCOMING",
			logs: {
				// Updating all (even if it always only have one) logs
				// Note: can't use update cuz documentsId aint unique
				updateMany: {
					data: {
						logDate: values.date_received,
						name: values.sender.name,
						office: values.sender.office,
						role: "SENDER",
					},
					where: {
						documentsId: values.id,
					},
				},
			},
			// files: files
			// 	? {
			// 			updateMany: {
			// 				data: files.map(file => ({
			// 					name: file.name,
			// 					size: file.size,
			// 				})),
			// 				where: {
			// 					documentsId: values.id,
			// 				},
			// 			},
			// 	  }
			// 	: undefined,
		},
	});

	return newDoc;
}

async function saveFiles(files: File[]) {
	// trying to read the directory to see its existence before actually uploading files to it
	try {
		await readdir(join(process.cwd(), "files"));
	} catch (error) {
		// then create the directory if not read/found
		console.log("Creating directory for files...");
		await mkdir(join(process.cwd(), "files"));
	}
	files.forEach(async file => {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const path = join(process.cwd(), "files", file.name);
		writeFile(path, buffer);
	});
}
