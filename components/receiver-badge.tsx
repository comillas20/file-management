import { Office } from "@prisma/client";
import { format } from "date-fns";

type ReceiverBadgeProps = {
	data: {
		name: string;
		date_released: string;
		office: Office;
	};
	className?: string;
};
export function ReceiverBadge({ data, className }: ReceiverBadgeProps) {
	return (
		<ul className={className}>
			<h5 className="text-sm font-medium">{data.date_released}</h5>
			<li className="ml-8 list-disc text-sm">
				{data.name.concat(" — ", data.office)}
			</li>
		</ul>
	);
}
