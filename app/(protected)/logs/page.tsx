"use client";
import { UserNav } from "@/app/components/user-nav";
import { Button } from "@/components/ui/button";
import { useDocuments } from "@/hooks/documents";
import { format, isBefore } from "date-fns";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
						.map((d, index) => (
							<ul key={index} className="space-y-1">
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
												: " sent to ",
											document.office,
											" @ ",
											format(document.logDate, "p")
										)}
									</li>
								))}
							</ul>
						))}
				</div>
			</main>
		</div>
	);
}
