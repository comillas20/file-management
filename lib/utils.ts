import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateRandomString(length: number): string {
	const charset =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result = "";

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * charset.length);
		result += charset[randomIndex];
	}

	return result;
}

export function fileWrapper(files: File[]) {
	const filesFD = new FormData();
	files.forEach(file => filesFD.append("file", file));
	return filesFD;
}
export function fileUnwrapper(files: FormData) {
	const fileParser = z.instanceof(File);
	return files
		.getAll("file")
		.filter(file => fileParser.safeParse(file).success) as File[];
}
