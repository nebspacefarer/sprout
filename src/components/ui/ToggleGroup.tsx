import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import type { Signal } from "@preact/signals";
import type { BaseHTMLAttributes } from "preact";

interface ToggleGroupProps extends BaseHTMLAttributes<HTMLBaseElement> {
    defaultValue: string[];
    value: Signal<string[]>;
}

export default function ToggleGroup(props: ToggleGroupProps) {
    return (
        <BaseToggleGroup
            defaultValue={props.defaultValue}
            value={props.value.value}
            className="flex gap-px rounded-md border border-border bg-crust"
            onValueChange={(value) => (props.value.value = value)}
        >
            {props.children}
        </BaseToggleGroup>
    );
}
