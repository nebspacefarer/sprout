import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";

interface TagProps extends BaseHTMLAttributes<HTMLBaseElement> { }

export default function Tag(props: TagProps) {
    return (
        <div
            className={cn(
                "w-fit rounded-xl bg-primary px-xs text-sm",
                props.className,
            )}
        >
            {props.children}
        </div>
    );
}
