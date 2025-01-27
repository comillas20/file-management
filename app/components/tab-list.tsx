import { buttonVariants } from "@/components/ui/button";
import { Flow } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { UserNav } from "./user-nav";

type TabListProps = {
	flow: Flow;
};
export function TabList({ flow }: TabListProps) {
	return (
		<div className="flex items-center">
			<div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground shadow-md bg-green-300">
				<Link
					className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
					href="/incoming"
					data-state={flow === "INCOMING" && "active"}>
					Incoming
				</Link>
				<Link
					className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
					href="/outgoing"
					data-state={flow === "OUTGOING" && "active"}>
					Outgoing
				</Link>
			</div>
			<div className="ml-auto flex items-center gap-4">
				{flow === "INCOMING" ? (
					<Link
						href="/incoming/create"
						className={buttonVariants({
							className: "gap-1 px-3 shadow-md",
						})}>
						<PlusCircle className="size-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							New Incoming Document
						</span>
					</Link>
				) : (
					<Link
						href="/outgoing/create"
						className={buttonVariants({
							className: "gap-1 px-3 shadow-md",
						})}>
						<PlusCircle className="size-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							New Outgoing Document
						</span>
					</Link>
				)}
				<UserNav />
			</div>
		</div>
	);
}
