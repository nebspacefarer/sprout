import { Avatar as BaseAvatar } from "@base-ui/react/avatar";

export default function Avatar({
	src,
	fallback,
}: {
	src: string;
	fallback: string;
}) {
	return (
		<div>
			<BaseAvatar.Root className="flex overflow-hidden rounded-full">
				<BaseAvatar.Image
					src={src}
					width="48"
					height="48"
					className="object-cover"
				/>
				<BaseAvatar.Fallback delay={600}>
					{fallback}
				</BaseAvatar.Fallback>
			</BaseAvatar.Root>
		</div>
	);
}
