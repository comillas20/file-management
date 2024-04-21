import { buttonVariants } from "@/components/ui/button";
import { Flow } from "@prisma/client";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

type TabListProps = {
	flow: Flow;
};
export function TabList({ flow }: TabListProps) {
	return (
		<div className="flex items-center">
			<div className="inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground">
				<Link
					className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
					href="/incoming"
					data-state={flow === "INCOMING" && "active"}>
					Incoming
				</Link>
				<Link
					className="inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
					href="/outgoing"
					data-state={flow === "OUTGOING" && "active"}>
					Outgoing
				</Link>
			</div>
			<div className="ml-auto flex items-center gap-2">
				{flow === "INCOMING" ? (
					<Link
						href="/incoming/create"
						className={buttonVariants({
							className: "h-8 gap-1 px-3",
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
							className: "h-8 gap-1 px-3",
						})}>
						<PlusCircle className="size-3.5" />
						<span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
							New Outgoing Document
						</span>
					</Link>
				)}
			</div>
		</div>
	);
}
