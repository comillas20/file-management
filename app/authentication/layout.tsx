export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="flex flex-col sm:gap-4 sm:py-4 sm:px-14 bg-page bg-fixed bg-no-repeat bg-cover h-screen">
			{children}
		</div>
	);
}
