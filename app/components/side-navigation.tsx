import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { FolderClosedIcon, Settings } from "lucide-react";
import Link from "next/link";
export function SideNavigation({}) {
	return (
		<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
			<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="/incoming"
							className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
							<FolderClosedIcon className="size-5" />
							<span className="sr-only">Documents</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Documents</TooltipContent>
				</Tooltip>
			</nav>
			<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="#"
							className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
							<Settings className="size-5" />
							<span className="sr-only">Settings</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Settings</TooltipContent>
				</Tooltip>
			</nav>
		</aside>
	);
}
