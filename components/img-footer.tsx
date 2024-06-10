import Image from "next/image";
import footer from "@/public/assets/images/footer-bg.png";

type ImgFooterProps = {
	className?: string;
};
export function ImgFooter({ className }: ImgFooterProps) {
	return (
		<div className={className}>
			<Image src={footer} alt="footer" width={778} height={56} />
		</div>
	);
}
