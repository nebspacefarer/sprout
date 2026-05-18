import type { Signal } from "@preact/signals";
import type { BaseHTMLAttributes } from "preact";
import Text from "./Text";

interface EditorProps extends BaseHTMLAttributes<HTMLBaseElement> {
    placeholder: string;
    editorTitle?: string;
    value: Signal<string>;
}

export default function MarkdownEditor(props: EditorProps) {
    return (
        <div className="flex flex-col gap-xs">
            <Text className="font-bold text-sm">{props.editorTitle}</Text>
            <div
                className="h-[400px] rounded-md border border-border bg-crust p-xs transition-all focus:border-muted focus:outline-unset"
                contentEditable
            >
                {props.value.value}
            </div>
        </div>
    );
}
