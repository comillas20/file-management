"use client";
import { UserNav } from "@/app/components/user-nav";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useDocuments } from "@/hooks/documents";
import { format, getYear, isBefore, isSameMonth, isSameYear } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

export default function LogsPage() {
	const { getDocumentsByLogDate } = useDocuments();
	const data = getDocumentsByLogDate();
	const router = useRouter();
	return (
		<div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
			<main className="mx-auto grid w-[59rem] flex-1 auto-rows-max gap-4">
				<div className="flex items-center gap-4">
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="size-7"
						onClick={() => router.back()}>
						<ChevronLeft className="size-4" />
						<span className="sr-only">Back</span>
					</Button>
					<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis">
						Logs
					</h1>
					<div className="flex justify-end ml-auto">
						<UserNav />
					</div>
				</div>
				<div className="border border-card p-4 flex flex-col gap-4">
					{data
						?.sort((a, b) =>
							isBefore(a.logDate, b.logDate) ? 1 : -1
						)
						.map((d, index, data) => {
							const isMonthBlockStart =
								index > 0 &&
								!isSameMonth(
									data[index - 1].logDate,
									d.logDate
								);

							const isFirstMonthBlock = index === 0;

							return (
								<React.Fragment key={index}>
									{(isMonthBlockStart ||
										isFirstMonthBlock) && (
										<div className="py-2 relative flex items-center justify-center">
											<Separator className="absolute" />
											<span className="bg-background px-2 font-bold z-10">
												{format(d.logDate, "MMMM yyyy")}
											</span>
										</div>
									)}
									<ul className="space-y-1">
										<h4 className="font-medium text-lg">
											{format(d.logDate, "PPP")}
										</h4>
										{d.documents.map(document => (
											<li
												key={document.id}
												className="ml-8 list-disc text-lg">
												{document.subject.concat(
													document.flow === "INCOMING"
														? " received from "
														: document.purpose ===
														  "INFORMATION"
														? " sent to "
														: " sent to be signed by ",
													document.office,
													" @ ",
													format(
														document.logDate,
														"p"
													)
												)}
											</li>
										))}
									</ul>
								</React.Fragment>
							);
						})}
				</div>
			</main>
		</div>
	);
}
