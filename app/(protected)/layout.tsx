import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = await validateRequest();
	if (!user) redirect("/authentication/login");
	// for authentication purposes only
	return <>{children}</>;
}
