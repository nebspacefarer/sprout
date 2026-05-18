import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import type { Signal } from "@preact/signals";
import { IconCheck, IconChevronDown, IconX } from "@tabler/icons-preact";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface SelectProps extends BaseHTMLAttributes<HTMLBaseElement> {
    selectTitle: string;
    items: string[];
    placeholder: string;
    value: Signal<string>;
    horizontal?: boolean;
}

export default function Select(props: SelectProps) {
    if (props.horizontal === undefined) props.horizontal = false;

    return (
        <BaseCombobox.Root items={props.items}>
            <div
                className={cn(
                    "relative flex w-fit items-center gap-xs leading-5",
                    !props.horizontal && "flex-col items-start gap-1",
                )}
            >
                <label htmlFor={props.id}>{props.selectTitle}</label>
                <BaseCombobox.InputGroup className="relative box-content h-10 w-fit rounded-md border border-border focus-within:outline-2 focus-within:outline-border focus-within:-outline-offset-1 [&>input]:pr-[calc(0.5rem+1.5rem)] has-[.combobox-clear]:[&>input]:pr-[calc(0.5rem+1.5rem*2)]">
                    <BaseCombobox.Input
                        id={props.id}
                        placeholder={props.placeholder}
                        value={props.value}
                        onInput={(event) =>
                            (props.value.value = event.currentTarget.value)
                        }
                        onFocusOut={() => {
                            if (
                                props.items.includes(props.value.value) ===
                                false
                            )
                                props.value.value = "";
                        }}
                        className="h-full w-full border-0 bg-transparent pl-3.5 outline-none"
                    />
                    <div className="absolute right-2 bottom-0 flex h-10 items-center justify-center">
                        <BaseCombobox.Clear
                            className="combobox-clear flex h-10 w-6 items-center justify-center rounded bg-transparent p-0"
                            aria-label="Clear selection"
                            onClick={() => (props.value.value = "")}
                        >
                            <IconX size={12} />
                        </BaseCombobox.Clear>
                        <BaseCombobox.Trigger
                            className="flex h-10 w-6 items-center justify-center rounded bg-transparent p-0"
                            aria-label="Open popup"
                        >
                            <IconChevronDown size={12} />
                        </BaseCombobox.Trigger>
                    </div>
                </BaseCombobox.InputGroup>
            </div>
            <BaseCombobox.Portal>
                <BaseCombobox.Positioner
                    className="outline-none"
                    sideOffset={4}
                >
                    <BaseCombobox.Popup className="max-h-[23rem] w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-hidden rounded-md bg-[canvas] pt-0 shadow-black shadow-lg outline-1 outline-surface transition-[transform,scale,opacity] duration-100 data-[ending-style]:scale-95 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 dark:shadow-none dark:outline-surface">
                        <BaseCombobox.Empty>
                            <div className="p-4 text-[0.925rem] text-muted leading-4">
                                None found.
                            </div>
                        </BaseCombobox.Empty>
                        <BaseCombobox.List className="max-h-[min(23rem,var(--available-height))] scroll-pt-[2.25rem] scroll-pb-[0.5rem] overflow-y-auto overscroll-contain outline-0">
                            <BaseCombobox.Collection>
                                {(item: string) => (
                                    <BaseCombobox.Item
                                        key={item}
                                        className="grid cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-8 pl-4 leading-4 outline-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:text-gray-50 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-2 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm data-[highlighted]:before:bg-gray-900"
                                        value={item}
                                        onClick={() =>
                                            (props.value.value = item)
                                        }
                                    >
                                        <BaseCombobox.ItemIndicator className="col-start-1 flex items-center justify-center text-foreground">
                                            <IconCheck size={12} />
                                        </BaseCombobox.ItemIndicator>
                                        <span className="col-start-2">
                                            {item}
                                        </span>
                                    </BaseCombobox.Item>
                                )}
                            </BaseCombobox.Collection>
                        </BaseCombobox.List>
                    </BaseCombobox.Popup>
                </BaseCombobox.Positioner>
            </BaseCombobox.Portal>
        </BaseCombobox.Root>
    );
}
