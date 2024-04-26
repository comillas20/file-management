import { getDocuments } from "@/action/documents";
import { Documents, Log } from "@prisma/client";
import { isSameDay } from "date-fns";
import useSWR, { mutate } from "swr";

export function useDocuments() {
	const { data, error, isLoading } = useSWR("useDocuments", getDocuments);
	const revalidateDocuments = () => {
		mutate("useDocuments");
	};
	const getDocumentById = (id: string) => {
		return data?.find(d => d.id === id);
	};
	const getDocumentsByLogDate = () => {
		let docsInLogDate: {
			logDate: Date;
			documents: (Documents & Log)[];
		}[] = [];
		data?.forEach(doc => {
			doc.logs.forEach(log => {
				let logDate = log.logDate;
				let document = { ...doc, ...log }; // This merges the properties of doc and log
				let existingItem = docsInLogDate.find(item =>
					isSameDay(item.logDate, logDate)
				);

				if (existingItem) {
					// If an item with this logDate already exists, add the document to its documents array
					existingItem.documents.push(document);
				} else {
					// If no item with this logDate exists, create a new item
					docsInLogDate.push({
						logDate: logDate,
						documents: [document],
					});
				}
			});
		});

		return docsInLogDate;
	};

	return {
		data,
		error,
		isLoading,
		revalidateDocuments,
		getDocumentById,
		getDocumentsByLogDate,
	};
}
