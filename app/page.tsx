import { PlusCircle } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabContents } from "./components/tab-contents";
import Link from "next/link";

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
					<TabsContent
						value="incoming"
						className="ml-auto flex items-center gap-2">
						<Link
							href="/incoming"
							className={buttonVariants({
								className: "h-8 gap-1 px-3",
							})}>
							<PlusCircle className="size-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								New Incoming Document
							</span>
						</Link>
					</TabsContent>
					<TabsContent
						value="outgoing"
						className="flex items-center gap-2">
						<Link
							href="/outgoing"
							className={buttonVariants({
								className: "h-8 gap-1 px-3",
							})}>
							<PlusCircle className="size-3.5" />
							<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
								New Outgoing Document
							</span>
						</Link>
					</TabsContent>
				</div>
				<TabContents />
			</Tabs>
		</main>
	);
}
