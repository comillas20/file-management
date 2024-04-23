import { logout } from "@/action/authentication";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { SignOutButton } from "@/components/ui/sign-out-button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { validateRequest } from "@/lib/auth";
import { FolderClosedIcon, Settings, User2 } from "lucide-react";
import Link from "next/link";
export async function SideNavigation({}) {
	const { user } = await validateRequest();
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
				{/* <Tooltip>
					<TooltipTrigger asChild>
						<Link
							href="#"
							className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8">
							<Settings className="size-5" />
							<span className="sr-only">Settings</span>
						</Link>
					</TooltipTrigger>
					<TooltipContent side="right">Settings</TooltipContent>
				</Tooltip> */}

				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="flex items-center justify-center rounded-full bg-muted"
							size="sm">
							{user ? (
								user.username.charAt(0).toUpperCase()
							) : (
								<User2 className="rounded-full aspect-square size-full" />
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent side="right" className="w-auto p-2">
						{user ? (
							<SignOutButton className="px-2" />
						) : (
							<Link href="/authentication/login">Login</Link>
						)}
					</PopoverContent>
				</Popover>
			</nav>
		</aside>
	);
}
