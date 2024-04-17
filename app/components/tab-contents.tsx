"use client";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { DocumentTable } from "./document-table";
import { incDocColumns, outDocColumns } from "./columns";

export function TabContents() {
	return (
		<React.Fragment>
			{/* <TabsContent value="all">
				<DocumentTable title="All Documents" columns={allDocColumns} />
			</TabsContent> */}
			<TabsContent value="incoming">
				<DocumentTable
					title="Incoming Documents"
					columns={incDocColumns}
				/>
			</TabsContent>
			<TabsContent value="outgoing">
				<DocumentTable
					title="Outgoing Documents"
					columns={outDocColumns}
				/>
			</TabsContent>
		</React.Fragment>
	);
}
