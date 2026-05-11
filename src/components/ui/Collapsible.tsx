import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { useSignal } from "@preact/signals";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-preact";
import type { BaseHTMLAttributes } from "preact";
import Show from "./Show";
import Text from "./Text";

interface CollapsibleProps extends BaseHTMLAttributes<HTMLBaseElement> {
	title: string;
}

export default function Collapsible(props: CollapsibleProps) {
	const open = useSignal(false);

	return (
		<BaseCollapsible.Root
			open={open.value}
			onOpenChange={() => (open.value = !open.value)}
		>
			<BaseCollapsible.Trigger className="flex w-full cursor-pointer items-center gap-xs">
				<Show when={open.value}>
					<IconChevronUp size={18} />
				</Show>
				<Show when={!open.value}>
					<IconChevronDown size={18} />
				</Show>

				<Text className="font-bold">{props.title}</Text>
			</BaseCollapsible.Trigger>
			<BaseCollapsible.Panel className="h-[var(--collapsible-panel-height)] flex-col justify-end overflow-hidden transition-all duration-150 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
				<div className="p-xs">{props.children}</div>
			</BaseCollapsible.Panel>
		</BaseCollapsible.Root>
	);
}
