"use client";

import { buttonVariants } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import yuri from "@/public/yuri.jpg";
import { ThumbsUpIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type AboutProps = {
	className?: string;
};
export function About({ className }: AboutProps) {
	return (
		<Dialog>
			<DialogTrigger
				className={buttonVariants({
					variant: "outline",
					size: "icon",
					className: className,
				})}>
				<ThumbsUpIcon />
			</DialogTrigger>
			<DialogContent className="h-60">
				<DialogHeader>
					<DialogTitle>DMS</DialogTitle>
				</DialogHeader>
				<div>This work was done by</div>
				<Link
					href="https://www.facebook.com/comillas20"
					target="_blank"
					className="flex gap-8 items-center ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground p-4">
					<Image
						src={yuri}
						alt="yuri"
						className="object-cover size-20 rounded-full"
						loading="lazy"
					/>
					<div>
						<p className="font-medium text-lg">
							Jino Joy C. Comillas
						</p>
						<p className="text-sm font-medium">OJT @ PICTU</p>
						<p className="text-xs">March - June 2024</p>
					</div>
				</Link>
			</DialogContent>
		</Dialog>
	);
}
