import { Menu } from "@base-ui/react/menu";
import type { Signal } from "@preact/signals";
import { IconCheck, IconChevronDown } from "@tabler/icons-preact";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import { cn } from "#utils/cn";

interface MenuCheckboxProps extends BaseHTMLAttributes<HTMLBaseElement> {
    menuTitle: string | ComponentChildren;
}

export function MenuCheckbox(props: MenuCheckboxProps) {
    return (
        <Menu.Root>
            <Menu.Trigger className="flex h-10 select-none items-center justify-center gap-xs rounded-md border border-border bg-crust px-xs font-normal text-foreground hover:bg-border focus-visible:outline-2 focus-visible:outline-border focus-visible:-outline-offset-1 active:bg-border data-[popup-open]:bg-border">
                {props.menuTitle} <IconChevronDown size={10} />
            </Menu.Trigger>
            <Menu.Portal>
                <Menu.Positioner className="outline-hidden" sideOffset={8}>
                    <Menu.Popup className="origin-[var(--transform-origin)] rounded-md bg-[canvas] py-1 text-muted shadow-black/60 shadow-lg outline-1 outline-border transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0">
                        <Menu.Arrow className="data-[side=bottom]:top-[-8px] data-[side=left]:right-[-13px] data-[side=top]:bottom-[-8px] data-[side=right]:left-[-13px] data-[side=left]:rotate-90 data-[side=right]:-rotate-90 data-[side=top]:rotate-180">
                            <ArrowSvg />
                        </Menu.Arrow>
                        {props.children}
                    </Menu.Popup>
                </Menu.Positioner>
            </Menu.Portal>
        </Menu.Root>
    );
}

interface MenuCheckboxItemProps extends BaseHTMLAttributes<HTMLBaseElement> {
    checked: Signal<boolean>;
}

export function MenuCheckboxItem(props: MenuCheckboxItemProps) {
    return (
        <Menu.CheckboxItem
            checked={props.checked.value}
            onCheckedChange={() => (props.checked.value = !props.checked.value)}
            className={cn(
                "grid min-w-40 grid-cols-6 items-center gap-xs p-xs text-sm leading-4 outline-hidden data-[highlighted]:relative data-[highlighted]:z-0 data-[disabled]:text-muted data-[highlighted]:text-foreground data-[disabled]:data-[highlighted]:before:bg-border data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-border",
                props.checked.value && "text-foreground",
            )}
        >
            <div className="col-span-1">
                <Menu.CheckboxItemIndicator>
                    <IconCheck size={12} />
                </Menu.CheckboxItemIndicator>
            </div>

            <div className="col-span-5">{props.children}</div>
        </Menu.CheckboxItem>
    );
}

function ArrowSvg(props: React.ComponentProps<"svg">) {
    return (
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none" {...props}>
            <title>Arrow</title>
            <path
                d="M9.66437 2.60207L4.80758 6.97318C4.07308 7.63423 3.11989 8 2.13172 8H0V10H20V8H18.5349C17.5468 8 16.5936 7.63423 15.8591 6.97318L11.0023 2.60207C10.622 2.2598 10.0447 2.25979 9.66437 2.60207Z"
                className="fill-[canvas]"
            />
            <path
                d="M8.99542 1.85876C9.75604 1.17425 10.9106 1.17422 11.6713 1.85878L16.5281 6.22989C17.0789 6.72568 17.7938 7.00001 18.5349 7.00001L15.89 7L11.0023 2.60207C10.622 2.2598 10.0447 2.2598 9.66436 2.60207L4.77734 7L2.13171 7.00001C2.87284 7.00001 3.58774 6.72568 4.13861 6.22989L8.99542 1.85876Z"
                className="fill-border dark:fill-border"
            />
            <path
                d="M10.3333 3.34539L5.47654 7.71648C4.55842 8.54279 3.36693 9 2.13172 9H0V8H2.13172C3.11989 8 4.07308 7.63423 4.80758 6.97318L9.66437 2.60207C10.0447 2.25979 10.622 2.2598 11.0023 2.60207L15.8591 6.97318C16.5936 7.63423 17.5468 8 18.5349 8H20V9H18.5349C17.2998 9 16.1083 8.54278 15.1901 7.71648L10.3333 3.34539Z"
                className="dark:fill-border"
            />
        </svg>
    );
}
