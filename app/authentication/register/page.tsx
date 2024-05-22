import { ENABLE_REGISTRATION } from "@/config";
import { RegisterForm } from "./components/register-form";
import { Separator } from "@/components/ui/separator";

export default function RegisterPage() {
	if (ENABLE_REGISTRATION)
		return (
			<main className="flex items-center justify-center min-h-screen sm:-my-4">
				<RegisterForm />
			</main>
		);
	else
		return (
			<main className="flex items-center justify-center min-h-screen sm:-my-4 bg-muted">
				<div className="flex gap-4">
					<h5 className="text-xl font-semibold">404</h5>
					<Separator orientation="vertical" className="h-auto" />
					<h5 className="text-lg font-medium">Nuh uh</h5>
				</div>
			</main>
		);
}
