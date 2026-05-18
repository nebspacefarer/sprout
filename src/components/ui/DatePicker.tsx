import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { type Signal, useSignal } from "@preact/signals";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface PickerProps extends BaseHTMLAttributes<HTMLBaseElement> {
    selected: Signal<string>;
}

export default function DatePicker(props: PickerProps) {
    const date = useSignal<Date>(new Date());

    return (
        <DayPicker
            timeZone="Europe/Paris"
            mode="single"
            captionLayout="dropdown"
            selected={date.value}
            onSelect={(newDate) => {
                date.value = newDate;
                props.selected.value = newDate.toISOString();
            }}
            footer={
                props.selected.value
                    ? `Selected ${props.selected.value}`
                    : "Pick a date."
            }
            className={cn("p-xs", props.className)}
            classNames={{
                dropdown_root: "px-xs",
                today: "font-bold text-[var(--colors-primary-DEFAULT)]",
                selected: `rounded-[20px] border-2 border-[var(--colors-primary-DEFAULT)] font-bold`,
                chevron: "fill-[var(--colors-primary-DEFAULT)]",
                footer: "text-center text-sm",
            }}
        />
    );
}
