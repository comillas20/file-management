"use client";
import { UserNav } from "@/app/components/user-nav";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useDocuments } from "@/hooks/documents";
import { format, isBefore, isSameMonth } from "date-fns";
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
				<div className="flex items-center gap-4 bg-primary p-2 rounded-md">
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="size-7"
						onClick={() => router.back()}>
						<ChevronLeft className="size-4" />
						<span className="sr-only">Back</span>
					</Button>
					<h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 text-ellipsis text-primary-foreground">
						Logs
					</h1>
					<div className="flex justify-end ml-auto">
						<UserNav />
					</div>
				</div>
				<ScrollArea className="max-h-[75vh]">
					<div className="p-4 flex flex-col gap-y-4 ">
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
													{format(
														d.logDate,
														"MMMM yyyy"
													)}
												</span>
											</div>
										)}
										<ul className="space-y-1 bg-muted p-4 rounded-md">
											<h4 className="font-semibold text-lg">
												{format(d.logDate, "PPP")}
											</h4>
											{d.documents.map(document => (
												<li
													key={document.id}
													className="ml-8 list-disc text-lg space-x-1.5">
													<span className="font-medium">
														{document.subject}
													</span>
													{document.flow ===
													"INCOMING" ? (
														<span className="text-blue-600">
															received from
														</span>
													) : (
														<span className="text-green-600">
															sent to
														</span>
													)}
													<span>
														{document.office.concat(
															" @ ",
															format(
																document.logDate,
																"p"
															)
														)}
													</span>
												</li>
											))}
										</ul>
									</React.Fragment>
								);
							})}
					</div>
				</ScrollArea>
			</main>
		</div>
	);
}
