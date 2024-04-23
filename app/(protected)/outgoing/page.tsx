"use client";
import { useDocuments } from "@/hooks/documents";
import { outDocColumns } from "@/app/components/columns";
import { DocumentTable } from "@/app/components/document-table";
import { TabList } from "@/app/components/tab-list";

export default function OutgoingPage() {
	const { data } = useDocuments();
	const filtered = data?.filter(d => d.flow === "OUTGOING");
	return (
		<main
			className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8"
			key="outgoing">
			<TabList flow="OUTGOING" />
			<DocumentTable
				key="outgoing-key"
				data={filtered}
				title="Outgoing Documents"
				columns={outDocColumns}
				flow="OUTGOING"
			/>
		</main>
	);
}
