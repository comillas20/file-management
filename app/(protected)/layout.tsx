import { ImgFooter } from "@/components/img-footer";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = await validateRequest();
	if (!user) redirect("/authentication/login");

	return (
		<div className="flex flex-col sm:gap-4 sm:py-4 sm:px-14 bg-page2 bg-fixed bg-no-repeat bg-cover h-screen">
			{children}
			<ImgFooter className="flex justify-center" />
		</div>
	);
}
