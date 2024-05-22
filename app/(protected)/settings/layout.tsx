import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserNav } from "@/app/components/user-nav";

const sidebarNavItems = [
	{
		title: "Account",
		href: "/settings",
	},
];

interface SettingsLayoutProps {
	children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
	return (
		<main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<Card className="space-y-6">
				<CardHeader className="flex flex-row justify-between items-start">
					<div className="space-y-0.5">
						<h2 className="text-2xl font-bold tracking-tight">
							Settings
						</h2>
						<p className="text-muted-foreground">
							Manage your account settings and set e-mail
							preferences.
						</p>
					</div>
					<UserNav />
				</CardHeader>
				<Separator className="my-6" />
				<CardContent className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
					<aside className="lg:w-1/5">
						<SidebarNav items={sidebarNavItems} />
					</aside>
					<div className="flex-1 lg:max-w-2xl">{children}</div>
				</CardContent>
			</Card>
		</main>
	);
}
