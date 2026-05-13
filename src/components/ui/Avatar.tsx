import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";
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
					"flex overflow-hidden rounded-full",
					props.className,
				)}
			>
				<BaseAvatar.Image
					src={props.src}
					width={props.size ?? "48"}
					height={props.size ?? "48"}
				/>
				<BaseAvatar.Fallback delay={600}>
					<Text>{props.fallback}</Text>
				</BaseAvatar.Fallback>
			</BaseAvatar.Root>
		</div>
	);
}
