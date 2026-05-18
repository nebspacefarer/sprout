import { Toolbar as BaseToolbar } from "@base-ui/react";
import type { BaseHTMLAttributes } from "preact";

interface ToolbarProps extends BaseHTMLAttributes<HTMLBaseElement> { }

export default function Toolbar(props: ToolbarProps) {
    return (
        <BaseToolbar.Root className="flex items-center gap-sm rounded-md bg-crust p-xs text-foreground shadow-black/30 shadow-md">
            {props.children}
        </BaseToolbar.Root>
    );
}
