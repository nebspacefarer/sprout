import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface CardProps extends BaseHTMLAttributes<HTMLBaseElement> {
    orientation?: "row" | "col";
    small?: boolean;
}

export default function Card(props: CardProps) {
    if (props.orientation === undefined) props.orientation = "row";
    if (props.small === undefined) props.small = false;

    return (
        <div
            className={cn(
                "flex items-center rounded-xl bg-crust",
                props.small ? "px-sm py-xs" : "p-sm",
                props.className,
                props.orientation === "col"
                    ? "flex-col items-start gap-1"
                    : "gap-sm",
            )}
        >
            {props.children}
        </div>
    );
}
