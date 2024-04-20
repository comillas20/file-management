import { getDocuments } from "@/action/documents";
import useSWR, { mutate } from "swr";

export function useDocuments() {
	const { data, error } = useSWR("useDocuments", getDocuments);
	const revalidateDocuments = () => {
		mutate("useDocuments");
	};
	return { data, error, revalidateDocuments };
}
