import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import type { BaseHTMLAttributes } from "preact";

interface ToggleGroupProps extends BaseHTMLAttributes<HTMLBaseElement> {
    defaultValue: string[];
}

export default function ToggleGroup(props: ToggleGroupProps) {
    return (
        <BaseToggleGroup
            defaultValue={props.defaultValue}
            className="flex gap-px rounded-md border border-border bg-crust"
        >
            {props.children}
        </BaseToggleGroup>
    );
}
