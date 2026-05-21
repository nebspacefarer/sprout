import { Combobox as BaseCombobox } from "@base-ui/react/combobox";
import { useDeepSignal } from "@deepsignal/preact";
import type { Signal } from "@preact/signals";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-preact";
import type { BaseHTMLAttributes } from "preact";
import { useRef } from "preact/hooks";

interface ComboboxProps extends BaseHTMLAttributes<HTMLBaseElement> {
    id: string;
    comboTitle: string;
    items: LabelItem[];
    placeholder: string;
    value: Signal<LabelItem[]>;
}

export function Combobox(props: ComboboxProps) {
    const comboboxStore = useDeepSignal({
        labels: props.items,
        selected: props.value.value,
        query: "",
    });

    const createInputRef = useRef<HTMLInputElement | null>(null);
    const comboboxInputRef = useRef<HTMLInputElement | null>(null);
    const pendingQueryRef = useRef<string>(null);
    const highlightedItemRef = useRef<LabelItem | undefined>(undefined);

    function handleInputKeyDown(event: KeyboardEvent) {
        if (event.key !== "Enter" || highlightedItemRef.current) {
            return;
        }

        const currentTrimmed = comboboxStore.query.value.trim();
        if (currentTrimmed === "") {
            return;
        }

        const normalized = currentTrimmed.toLocaleLowerCase();
        const existing = comboboxStore.labels.value.find(
            (label) => label.value.trim().toLocaleLowerCase() === normalized,
        );

        if (existing) {
            const prev: LabelItem[] = comboboxStore.selected.value;
            comboboxStore.selected.value = prev.some(
                (i) => i.id === existing.id,
            )
                ? prev
                : [...prev, existing];

            comboboxStore.query.value = "";
            return;
        }

        pendingQueryRef.current = currentTrimmed;
    }

    function handleCreate() {
        const input = createInputRef.current || comboboxInputRef.current;
        const value = input ? input.value.trim() : "";
        if (!value) {
            return;
        }

        const normalized = value.toLocaleLowerCase();
        const baseId = normalized.replace(/\s+/g, "-");
        const existing = comboboxStore.labels.value.find(
            (l) => l.value.trim().toLocaleLowerCase() === normalized,
        );

        if (existing) {
            const prev: LabelItem[] = comboboxStore.selected.value;
            comboboxStore.selected.value = prev.some(
                (i) => i.id === existing.id,
            )
                ? prev
                : [...prev, existing];

            return;
        }

        // Ensure we don't collide with an existing id (e.g., value "docs" vs. existing id "docs")
        const existingIds = new Set(
            comboboxStore.labels.value.map((l) => l.id),
        );
        let uniqueId = baseId;
        if (existingIds.has(uniqueId)) {
            let i = 2;
            while (existingIds.has(`${baseId}-${i}`)) {
                i += 1;
            }
            uniqueId = `${baseId}-${i}`;
        }

        const newItem: LabelItem = { id: uniqueId, value };

        if (
            !comboboxStore.selected.value.find((item) => item.id === newItem.id)
        ) {
            comboboxStore.labels.value = [
                ...comboboxStore.labels.value,
                newItem,
            ];
            comboboxStore.selected.value = [
                ...comboboxStore.selected.value,
                newItem,
            ];

            props.value.value = comboboxStore.selected.value;
        }

        comboboxStore.query.value = "";
    }

    const trimmed = comboboxStore.query.value.trim();
    const lowered = trimmed.toLocaleLowerCase();
    const exactExists = comboboxStore.labels.value.some(
        (l) => l.value.trim().toLocaleLowerCase() === lowered,
    );
    // Show the creatable item alongside matches if there's no exact match
    const itemsForView: Array<LabelItem> =
        trimmed !== "" && !exactExists
            ? [
                ...comboboxStore.labels.value,
                {
                    creatable: trimmed,
                    id: `create:${lowered}`,
                    value: `Create "${trimmed}"`,
                },
            ]
            : comboboxStore.labels.value;

    return (
        <BaseCombobox.Root
            items={itemsForView}
            multiple
            onValueChange={(next) => {
                const creatableSelection = next.find(
                    (item) =>
                        item.creatable &&
                        !comboboxStore.selected.value.some(
                            (current) => current.id === item.id,
                        ),
                );

                if (creatableSelection?.creatable) {
                    pendingQueryRef.current = creatableSelection.creatable;
                    handleCreate();
                    return;
                }
                const clean = next.filter((i) => !i.creatable);
                comboboxStore.selected.value = clean;
                comboboxStore.query.value = "";
            }}
            value={comboboxStore.selected.value}
            inputValue={comboboxStore.query.value}
            onInputValueChange={(input) => (comboboxStore.query.value = input)}
            onItemHighlighted={(item) => {
                highlightedItemRef.current = item;
            }}
        >
            <div className="flex w-full flex-col gap-1">
                <label className="leading-5" htmlFor={props.id}>
                    {props.comboTitle}
                </label>
                <BaseCombobox.InputGroup className="cursor-text rounded-md bg-surface px-1.5 py-1 focus-within:outline-none focus-within:outline-2 focus-within:-outline-offset-1">
                    <BaseCombobox.Chips className="flex w-full flex-wrap items-center gap-0.5">
                        <BaseCombobox.Value>
                            {(value: LabelItem[]) => (
                                <>
                                    {value.map((label) => (
                                        <BaseCombobox.Chip
                                            key={label.id}
                                            className="flex cursor-default items-center gap-1 rounded-md border border-crust px-1.5 py-[0.2rem] text-sm outline-none focus-within:bg-none focus-within:text-muted [@media(hover:hover)]:[&[data-highlighted]]:bg-none [@media(hover:hover)]:[&[data-highlighted]]:text-gray-50"
                                            aria-label={label.value}
                                        >
                                            {label.value}

                                            <BaseCombobox.ChipRemove
                                                className="rounded-md p-1 text-inherit hover:bg-surface"
                                                aria-label={`Remove ${label.value}`}
                                            >
                                                <IconX size={12} />
                                            </BaseCombobox.ChipRemove>
                                        </BaseCombobox.Chip>
                                    ))}
                                    <BaseCombobox.Input
                                        ref={comboboxInputRef}
                                        id={props.id}
                                        placeholder={
                                            value.length > 0
                                                ? ""
                                                : "e.g. game , software , web"
                                        }
                                        className="h-8 flex-1 rounded-md border-0 bg-transparent pl-2 outline-none placeholder:text-muted"
                                        onKeyDown={handleInputKeyDown}
                                    />
                                </>
                            )}
                        </BaseCombobox.Value>
                    </BaseCombobox.Chips>
                </BaseCombobox.InputGroup>
            </div>

            <BaseCombobox.Portal>
                <BaseCombobox.Positioner
                    className="z-50 outline-none"
                    sideOffset={4}
                >
                    <BaseCombobox.Popup className="max-h-[min(var(--available-height),24rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] scroll-pt-2 scroll-pb-2 overflow-y-auto overscroll-contain rounded-lg bg-[canvas] py-2 shadow-black shadow-lg outline-1 outline-surface dark:shadow-none dark:outline-surface dark:-outline-offset-1">
                        <BaseCombobox.Empty>
                            <div className="px-4 py-2 text-[0.925rem] text-muted leading-4">
                                No labels found.
                            </div>
                        </BaseCombobox.Empty>
                        <BaseCombobox.List>
                            {(item: LabelItem) =>
                                item.creatable ? (
                                    <BaseCombobox.Item
                                        key={item.id}
                                        className="grid cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-sm pl-xs text-primary leading-4 outline-none [@media(hover:hover)]:[&[data-highlighted]]:relative [@media(hover:hover)]:[&[data-highlighted]]:z-0 [@media(hover:hover)]:[&[data-highlighted]]:before:absolute [@media(hover:hover)]:[&[data-highlighted]]:before:inset-x-2 [@media(hover:hover)]:[&[data-highlighted]]:before:inset-y-0 [@media(hover:hover)]:[&[data-highlighted]]:before:z-[-1] [@media(hover:hover)]:[&[data-highlighted]]:before:rounded-sm"
                                        value={item}
                                    >
                                        <span className="col-start-1">
                                            <IconPlus size={12} />
                                        </span>
                                        <span className="col-start-2">
                                            Create "{item.creatable}"
                                        </span>
                                    </BaseCombobox.Item>
                                ) : (
                                    <BaseCombobox.Item
                                        key={item.id}
                                        className="grid cursor-default select-none grid-cols-[0.75rem_1fr] items-center gap-2 py-2 pr-sm pl-xs text-foreground leading-4 outline-none [@media(hover:hover)]:[&[data-highlighted]]:relative [@media(hover:hover)]:[&[data-highlighted]]:z-0 [@media(hover:hover)]:[&[data-highlighted]]:text-muted [@media(hover:hover)]:[&[data-highlighted]]:before:absolute [@media(hover:hover)]:[&[data-highlighted]]:before:inset-x-2 [@media(hover:hover)]:[&[data-highlighted]]:before:inset-y-0 [@media(hover:hover)]:[&[data-highlighted]]:before:z-[-1] [@media(hover:hover)]:[&[data-highlighted]]:before:rounded-sm [@media(hover:hover)]:[&[data-highlighted]]:before:bg-gray-900"
                                        value={item}
                                    >
                                        <BaseCombobox.ItemIndicator className="col-start-1">
                                            <IconCheck size={12} />
                                        </BaseCombobox.ItemIndicator>
                                        <span className="col-start-2">
                                            {item.value}
                                        </span>
                                    </BaseCombobox.Item>
                                )
                            }
                        </BaseCombobox.List>
                    </BaseCombobox.Popup>
                </BaseCombobox.Positioner>
            </BaseCombobox.Portal>
        </BaseCombobox.Root>
    );
}

export type LabelItem = {
    creatable?: string;
    id: string;
    value: string;
};
