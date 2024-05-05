import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./components/account-form";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsAccountPage() {
	const { user } = await validateRequest();
	if (!user) redirect("/authentication/login");
	return (
		<div className="space-y-6">
			<div>
				<h3 className="text-lg font-medium">Account</h3>
				<p className="text-sm text-muted-foreground">
					Update your account settings
				</p>
			</div>
			<Separator />
			<AccountForm key={JSON.stringify(user)} data={user} />
		</div>
	);
}
