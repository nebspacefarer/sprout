import { Button as BaseButton } from "@base-ui/react/button";
import type { ButtonHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface ButtonProps extends ButtonHTMLAttributes<HTMLBaseElement> {
	onClick?: (event: MouseEvent) => void;
}

export default function Button(props: ButtonProps) {
	return (
		<BaseButton
			className={cn(
				"flex cursor-pointer select-none items-center justify-center rounded-md bg-primary px-xs font-semibold text-primary-foreground outline-0",
				props.className,
			)}
			onClick={props.onClick}
		>
			{props.children}
		</BaseButton>
	);
}
