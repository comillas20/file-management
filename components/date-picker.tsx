"use client";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";

type DatePickerProps = {
	date: Date;
	onDateChange: (date: Date | undefined) => void;
	className?: string;
};
export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
	return (
		<Popover>
			<PopoverTrigger
				className={buttonVariants({
					variant: "outline",
					className: cn(
						// Note: for some reason, px-3 doesn't work [Edge]
						"justify-between gap-2 font-normal px-[0.75rem]",
						!date && "text-muted-foreground",
						className
					),
				})}>
				<span>{date ? format(date, "eee, PPP") : "Pick a date"}</span>
				<CalendarIcon className="h-4 w-4" />
			</PopoverTrigger>
			<PopoverContent className="flex p-0 w-fit" align="start">
				<Calendar
					mode="single"
					selected={date}
					onSelect={onDateChange}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
