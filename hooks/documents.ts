import { getDocuments } from "@/action/documents";
import useSWR, { mutate } from "swr";

export function useDocuments() {
	const { data, error, isLoading } = useSWR("useDocuments", getDocuments);
	const revalidateDocuments = () => {
		mutate("useDocuments");
	};
	const getDocumentById = (id: string) => {
		return data?.find(d => d.id === id);
	};

	return { data, error, isLoading, revalidateDocuments, getDocumentById };
}
