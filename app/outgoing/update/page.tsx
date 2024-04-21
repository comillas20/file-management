"use client";
import { useSearchParams } from "next/navigation";
import { OutgoingForm } from "../components/form";
import { useDocuments } from "@/hooks/documents";
import { Loader2 } from "lucide-react";

export default function OutgoingUpdatePage() {
	const params = useSearchParams();
	const documentId = params.get("doc");
	const { getDocumentById } = useDocuments();

	const documentToUpdate = documentId
		? getDocumentById(documentId)
		: undefined;
	if (documentToUpdate) {
		return (
			<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
				<OutgoingForm data={documentToUpdate} />
			</main>
		);
	} else
		return (
			<div className="flex items-center justify-center">
				<Loader2 className="animate-spin" />
			</div>
		);
}
