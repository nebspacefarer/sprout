import { Button as BaseButton, type ButtonState } from "@base-ui/react/button";
import type {
	BaseUIComponentProps,
	NativeButtonProps,
} from "@base-ui/react/internals/types";
import { cn } from "#utils/cn";

interface ButtonProps
	extends NativeButtonProps,
	BaseUIComponentProps<"button", ButtonState> {
	onClick?: (event: MouseEvent) => void;
}

export default function Button(props: ButtonProps) {
	return (
		<BaseButton
			className={cn(
				"flex cursor-pointer select-none items-center justify-center rounded-md px-xs font-semibold outline-0",
				props.className,
			)}
			onClick={props.onClick}
			style={props.style}
		>
			{props.children}
		</BaseButton>
	);
}
