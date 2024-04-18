"use client";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
type TimePickerProps = {
	time: Date;
	onTimeChange: (time: Date) => void;
	className?: string;
};
export function TimePicker({ time, onTimeChange, className }: TimePickerProps) {
	return (
		<Input
			className={className}
			type="time"
			value={format(time, "HH:mm")}
			onChange={e =>
				onTimeChange(
					new Date(`${format(time, "PP")} ${e.target.value}`)
				)
			}
		/>
	);
}
