"use client";
import { useDocuments } from "@/hooks/documents";
import { incDocColumns } from "@/app/components/columns";
import { DocumentTable } from "@/app/components/document-table";
import { TabList } from "@/app/components/tab-list";

export default function IncomingPage() {
	const { data } = useDocuments();
	const filtered = data?.filter(d => d.flow === "INCOMING");
	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<TabList flow="INCOMING" />
			<DocumentTable
				key="incoming-key"
				data={filtered}
				title="Incoming Documents"
				columns={incDocColumns}
				flow="INCOMING"
			/>
		</main>
	);
}
