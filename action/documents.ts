"use server";

import prisma from "@/lib/db";
import { fileUnwrapper } from "@/lib/utils";
import { Office } from "@prisma/client";
import { access, mkdir, readdir, writeFile, stat } from "fs/promises";
import { join, parse } from "path";

type IncDocument = {
	id: string;
	subject: string;
	date_received: Date;
	eventDate: Date;
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
			eventDate: values.eventDate,
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
			eventDate: values.eventDate,
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
	eventDate: Date;
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
			eventDate: values.eventDate,
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
			eventDate: values.eventDate,
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
		const moddifiedFile = await modifyFile(file.name, file.size);
		const path = join(process.cwd(), "public/files", moddifiedFile.name);
		writeFile(path, buffer);
		return moddifiedFile;
	});

	return await Promise.all(filePromises);
}

async function modifyFile(filename: string, filesize: number) {
	let fileExists = true;
	let newFilename = filename;
	let newFilesize = filesize;
	const filePath = join(process.cwd(), "public/files", newFilename);

	for (var i = 2; fileExists; i++) {
		try {
			// error thrown if the file is either not accessable/does not exists
			await access(filePath);
			const { size } = await stat(filePath);

			/* same size means its the same file;
			   filesize === 0 means its a dummy file created in the client,
			   since I can't get the actual file from server to render;

			   Need to assume file doesnt exists, to replace the file upon saving,
			   in both cases
			 */
			if (filesize === 0 || filesize === size) {
				newFilesize = size; // only matters when filesize = 0
				fileExists = false;
				console.log({
					name: newFilename,
					filesize: filesize,
					size: size,
				});
				break;
			}
			const parsedPath = parse(filename);
			newFilename = join(
				parsedPath.dir,
				`${parsedPath.name} (${i})${parsedPath.ext}`
			);
		} catch (err) {
			fileExists = false;
			break;
		}
	}
	return {
		name: newFilename,
		size: newFilesize,
	};
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
