import { ScrollArea } from "@base-ui/react/scroll-area";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface ScrollProps extends BaseHTMLAttributes<HTMLBaseElement> { }

export default function Scroll(props: ScrollProps) {
	return (
		<ScrollArea.Root className="max-w-[calc(100vw-8rem)]">
			<ScrollArea.Viewport
				className={cn(
					"focus-visible:outline-2 focus-visible:outline-neutral-950 focus-visible:-outline-offset-1",
					props.className,
				)}
			>
				<ScrollArea.Content className="flex w-full flex-col gap-xs p-xs">
					{props.children}
				</ScrollArea.Content>
			</ScrollArea.Viewport>
			<ScrollArea.Scrollbar className="pointer-events-none m-xs flex w-2 translate-x-4 justify-center bg-black/30 opacity-100 transition-opacity data-hovering:pointer-events-auto data-scrolling:pointer-events-auto data-hovering:opacity-100 data-scrolling:opacity-100 data-scrolling:duration-0">
				<ScrollArea.Thumb className="w-full bg-foreground" />
			</ScrollArea.Scrollbar>
		</ScrollArea.Root>
	);
}
