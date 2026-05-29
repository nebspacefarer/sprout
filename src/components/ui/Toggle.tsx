import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface ToggleProps extends BaseHTMLAttributes<HTMLBaseElement> {
    value: string;
}

export default function Toggle(props: ToggleProps) {
    return (
        <BaseToggle
            value={props.value}
            className={cn(
                "flex size-10 select-none items-center justify-center rounded-sm hover:bg-muted focus-visible:bg-none focus-visible:outline-2 focus-visible:outline-border focus-visible:-outline-offset-1 active:bg-border data-[pressed]:bg-border",
                props.className,
            )}
            title={props.title}
        >
            {props.children}
        </BaseToggle>
    );
}
