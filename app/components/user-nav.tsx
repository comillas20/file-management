"use client";
import { getSession, logout } from "@/action/authentication";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";

const userNavButtons: { href: string; title: string }[] = [
	{ href: "/incoming", title: "Incoming" },
	{ href: "/outgoing", title: "Outgoing" },
	{ href: "/logs", title: "View Logs" },
	{ href: "/settings", title: "Settings" },
];
export function UserNav() {
	const { data } = useSWR("UserNav", getSession);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					className="flex items-center justify-center rounded-full bg-muted shadow-md"
					size="icon">
					{data && data.user ? (
						data.user.username.charAt(0).toUpperCase()
					) : (
						<User2 className="rounded-full aspect-square" />
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{data?.user?.username ?? "Guest"}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							Welcome back, {data?.user?.username ?? "Guest"}!
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{data && data.user ? (
					<>
						{userNavButtons.map((button, index) => (
							<DropdownMenuItem key={index} asChild>
								<Link href={button.href}>{button.title}</Link>
							</DropdownMenuItem>
						))}

						<DropdownMenuSeparator />
						<DropdownMenuItem onSelect={async () => logout()}>
							Logout
						</DropdownMenuItem>
					</>
				) : (
					<DropdownMenuItem asChild>
						<Link href="/authentication/login">Login</Link>
					</DropdownMenuItem>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
