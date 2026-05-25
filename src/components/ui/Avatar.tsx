import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";
import { toFallback } from "#utils/strings";
import Text from "./Text";

interface AvatarProps extends BaseHTMLAttributes<HTMLBaseElement> {
	src: string;
	fallback: string;
	size?: string;
}

export default function Avatar(props: AvatarProps) {
	return (
		<div>
			<BaseAvatar.Root
				className={cn(
					"flex items-center justify-center overflow-hidden rounded-full bg-surface",
					props.className,
				)}
				title={props.title}
			>
				<BaseAvatar.Image
					src={props.src}
					width={props.size ?? "48"}
					height={props.size ?? "48"}
				/>
				<BaseAvatar.Fallback delay={600}>
					<Text>{toFallback(props.fallback)}</Text>
				</BaseAvatar.Fallback>
			</BaseAvatar.Root>
		</div>
	);
}
