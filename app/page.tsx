import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LandingPage() {
	const { user } = await validateRequest();
	if (user) redirect("/incoming");
	else redirect("/authentication/login");
}
