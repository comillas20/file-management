import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import "@/style/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "File Management",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<TooltipProvider>
					<div className="flex min-h-screen w-full flex-col bg-muted/40">
						<div className="flex flex-col sm:gap-4 sm:py-4 sm:px-14">
							{children}
						</div>
					</div>
				</TooltipProvider>
				<Toaster />
			</body>
		</html>
	);
}
