import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface TextProps extends BaseHTMLAttributes<HTMLBaseElement> {
	size?: "normal" | "h1" | "h2" | "sm";
}

export default function Text(props: TextProps) {
	props.size = props.size ?? "normal";

	return (
		<p
			className={cn(
				props.size === "h1" && "text-xl",
				props.size === "h2" && "text-lg",
				props.size === "sm" && "text-sm",
				props.className,
			)}
			style={props.style}
		>
			{props.children}
		</p>
	);
}
