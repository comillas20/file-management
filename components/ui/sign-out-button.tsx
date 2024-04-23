"use client";

import { logout } from "@/action/authentication";

type SignOutButtonProps = {
	className?: string;
} & Omit<React.ComponentProps<"button">, "onClick">;
export const SignOutButton = ({ className, ...props }: SignOutButtonProps) => {
	return (
		<button className={className} {...props} onClick={async () => logout()}>
			Sign out
		</button>
	);
};
