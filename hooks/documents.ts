import { getDocuments } from "@/action/documents";
import { Flow } from "@prisma/client";
import useSWR, { mutate } from "swr";

export function useDocuments(flow?: Flow) {
	const { data, error } = useSWR("useDocuments", () => getDocuments(flow));
	const revalidateDocuments = () => {
		mutate("useDocuments");
	};
	const getDocumentById = (id: string) => {
		return data?.find(d => d.id === id);
	};

	return { data, error, revalidateDocuments, getDocumentById };
}
