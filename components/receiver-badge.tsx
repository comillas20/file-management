import { Office } from "@prisma/client";
import { format } from "date-fns";

type ReceiverBadgeProps = {
	data: {
		name: string;
		date_released: Date;
		office: Office;
	};
	className?: string;
};
export function ReceiverBadge({ data, className }: ReceiverBadgeProps) {
	return (
		<ul className={className}>
			<h5 className="text-sm font-medium">
				{format(data.date_released, "PPP p")}
			</h5>
			<li className="ml-8 list-disc text-sm">
				{data.name.concat(" — ", data.office)}
			</li>
		</ul>
	);
}
