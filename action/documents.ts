"use server";

import prisma from "@/lib/db";
import { fileUnwrapper } from "@/lib/utils";
import { Office, Purpose } from "@prisma/client";
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
	signatory: string | null;
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
			files: files
				? {
						deleteMany: {
							documentsId: values.id,
						},
						createMany: {
							data: files.map(file => ({
								name: file.name,
								size: file.size,
							})),
						},
				  }
				: {
						deleteMany: {
							documentsId: values.id,
						},
				  },
		},
	});

	return newDoc;
}

type OutgoingDocType = {
	id: string;
	subject: string;
	purpose: Purpose;
	files: FormData | null;
	recipient: {
		name: string;
		office: Office;
		date_released: Date;
	}[];
};
export async function createOrUpdateOutDocument(values: OutgoingDocType) {
	const files = values.files ? fileUnwrapper(values.files) : null;
	if (files) saveFiles(files);

	const newDoc = await prisma.documents.upsert({
		create: {
			subject: values.subject,
			purpose: values.purpose,
			flow: "OUTGOING",
			logs: {
				createMany: {
					data: values.recipient.map(value => ({
						logDate: value.date_released,
						name: value.name,
						office: value.office,
						role: "RECIPIENT",
					})),
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
			purpose: values.purpose,
			flow: "OUTGOING",
			logs: {
				deleteMany: {
					documentsId: values.id,
				},
				createMany: {
					data: values.recipient.map(value => ({
						logDate: value.date_released,
						name: value.name,
						office: value.office,
						role: "RECIPIENT",
					})),
				},
			},
			files: files
				? {
						deleteMany: {
							documentsId: values.id,
						},
						createMany: {
							data: files.map(file => ({
								name: file.name,
								size: file.size,
							})),
						},
				  }
				: {
						deleteMany: {
							documentsId: values.id,
						},
				  },
		},
	});

	return newDoc;
}

async function saveFiles(files: File[]) {
	// trying to read the directory to see its existence before actually uploading files to it
	try {
		await readdir(join(process.cwd(), "public/files"));
	} catch (error) {
		// then create the directory if not read/found
		console.log("Creating directory for files...");
		await mkdir(join(process.cwd(), "public/files"));
	}
	files.forEach(async file => {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const path = join(process.cwd(), "public/files", file.name);
		writeFile(path, buffer);
	});
}

export async function getDocuments() {
	return await prisma.documents.findMany({
		include: {
			logs: true,
			files: true,
		},
	});
}

export async function deleteDocuments(id: string) {
	return await prisma.documents.delete({
		where: {
			id,
		},
	});
}
