import { Popover as BasePopover } from "@base-ui/react/popover";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";

interface PopoverProps extends BaseHTMLAttributes<HTMLBaseElement> {
    popoverTitle: string;
    trigger: string | ComponentChildren;
    children: ComponentChildren;
}

export default function Popover(props: PopoverProps) {
    return (
        <BasePopover.Root>
            <BasePopover.Trigger className="cursor-pointer">
                {props.trigger}
            </BasePopover.Trigger>
            <BasePopover.Portal>
                <BasePopover.Positioner sideOffset={8}>
                    <BasePopover.Popup className="relative flex h-[var(--popup-height,auto)] w-[var(--popup-width,auto)] max-w-[500px] origin-[var(--transform-origin)] flex-col gap-1 border border-border bg-surface p-3 shadow-[0.25rem_0.25rem_0] shadow-black/12 outline-none transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0">
                        <BasePopover.Arrow className="relative block h-1.5 w-3 overflow-clip before:absolute before:bottom-0 before:left-1/2 before:h-[calc(6px*sqrt(2))] before:w-[calc(6px*sqrt(2))] before:border before:border-border before:bg-surface before:content-[''] data-[side=bottom]:top-[-6px] data-[side=left]:right-[-9px] data-[side=top]:bottom-[-6px] data-[side=right]:left-[-9px] data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=top]:rotate-180 before:[transform:translate(-50%,50%)_rotate(45deg)]" />
                        <BasePopover.Title className="p-xs font-bold text-sm">
                            {props.popoverTitle}
                        </BasePopover.Title>
                        <BasePopover.Description className="flex flex-col gap-xs text-sm">
                            {props.children}
                        </BasePopover.Description>
                    </BasePopover.Popup>
                </BasePopover.Positioner>
            </BasePopover.Portal>
        </BasePopover.Root>
    );
}
