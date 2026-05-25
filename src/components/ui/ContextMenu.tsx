import { ContextMenu as BaseContextMenu } from "@base-ui/react/context-menu";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";

interface ContextMenuProps extends BaseHTMLAttributes<HTMLBaseElement> {
    trigger: string | ComponentChildren;
    children: ComponentChildren;
}

export default function ContextMenu(props: ContextMenuProps) {
    return (
        <BaseContextMenu.Root>
            <BaseContextMenu.Trigger className="flex w-full select-none rounded-none border border-border bg-surface font-normal">
                {props.trigger}
            </BaseContextMenu.Trigger>
            <BaseContextMenu.Portal>
                <BaseContextMenu.Positioner className="outline-hidden">
                    <BaseContextMenu.Popup className="origin-[var(--transform-origin)] outline-hidden transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-starting-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:opacity-0">
                        {props.children}
                    </BaseContextMenu.Popup>
                </BaseContextMenu.Positioner>
            </BaseContextMenu.Portal>
        </BaseContextMenu.Root>
    );
}
