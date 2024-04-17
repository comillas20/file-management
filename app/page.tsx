import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContents } from "./components/tab-contents";

export default function Home() {
	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Tabs defaultValue="incoming">
				<div className="flex items-center">
					<TabsList>
						{/* <TabsTrigger value="all">All</TabsTrigger> */}
						<TabsTrigger value="incoming">Incoming</TabsTrigger>
						<TabsTrigger value="outgoing">Outgoing</TabsTrigger>
					</TabsList>
					<div className="ml-auto flex items-center gap-2">
						<Button size="sm" className="h-8 gap-1">
							<PlusCircle className="size-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								Add Document
							</span>
						</Button>
					</div>
				</div>
				<TabContents />
			</Tabs>
		</main>
	);
}
