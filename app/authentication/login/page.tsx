import { About } from "@/app/components/about";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
	return (
		<main className="flex items-center justify-center min-h-screen sm:-my-4">
			<LoginForm />
			<About className="hidden lg:flex fixed bottom-5 right-5 items-center justify-center" />
		</main>
	);
}
