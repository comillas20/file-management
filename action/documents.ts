"use server";

import prisma from "@/lib/db";
import { fileUnwrapper } from "@/lib/utils";
import { Office } from "@prisma/client";
import { access, mkdir, readdir, writeFile } from "fs/promises";
import { join, parse } from "path";

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
	remarks: string | null;
};

export async function createOrUpdateIncDocument(values: IncDocument) {
	const files = values.files ? fileUnwrapper(values.files) : null;
	if (files) saveFiles(files);

	const newDoc = await prisma.documents.upsert({
		create: {
			subject: values.subject,
			purpose: "Store",
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
			remarks: values.remarks,
		},
		where: {
			id: values.id,
		},
		update: {
			subject: values.subject,
			purpose: "Store",
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
			remarks: values.remarks,
		},
	});

	return newDoc;
}

type OutgoingDocType = {
	id: string;
	subject: string;
	purpose: string;
	files: FormData | null;
	remarks: string | null;
	recipient: {
		name: string;
		office: Office;
		date_released: Date;
	}[];
};
export async function createOrUpdateOutDocument(values: OutgoingDocType) {
	const files = values.files ? fileUnwrapper(values.files) : null;
	const moddifiedFiles = files ? await saveFiles(files) : null;

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
			files: moddifiedFiles
				? {
						createMany: {
							data: moddifiedFiles.map(file => ({
								name: file.name,
								size: file.size,
							})),
						},
				  }
				: undefined,
			remarks: values.remarks,
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
			files: moddifiedFiles
				? {
						deleteMany: {
							documentsId: values.id,
						},
						createMany: {
							data: moddifiedFiles.map(file => ({
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
			remarks: values.remarks,
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
		await mkdir(join(process.cwd(), "public/files"));
	}

	const filePromises = files.map(async file => {
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);
		const moddifiedFilename = await modifyFilename(file.name);
		const path = join(process.cwd(), "public/files", moddifiedFilename);
		writeFile(path, buffer);
		return {
			name: moddifiedFilename,
			size: file.size,
		};
	});

	return await Promise.all(filePromises);
}

async function modifyFilename(filename: string) {
	let fileExists = true;
	let newFilename = filename;

	for (var i = 2; fileExists; i++) {
		try {
			await access(join(process.cwd(), "public/files", newFilename));
			const parsedPath = parse(filename);
			newFilename = join(
				parsedPath.dir,
				`${parsedPath.name} (${i})${parsedPath.ext}`
			);
		} catch (err) {
			fileExists = false;
		}
	}
	return newFilename;
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
