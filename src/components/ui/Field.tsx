import { Field as BaseField } from "@base-ui/react/field";
import type { Signal } from "@preact/signals";
import type { BaseHTMLAttributes } from "preact";
import { cn } from "#utils/cn";
import Text from "./Text";

interface FieldProps extends BaseHTMLAttributes<HTMLBaseElement> {
    placeholder: string;
    fieldTitle: string;
    value: Signal<string>;
    horizontal?: boolean;
    type?: "text" | "password" | "email";
}

export default function Field(props: FieldProps) {
    if (props.horizontal === undefined) props.horizontal = false;

    return (
        <BaseField.Root
            className={cn(
                "flex items-center gap-xs",
                !props.horizontal && "flex-col items-start gap-1",
            )}
        >
            <BaseField.Label
                className={cn(
                    "font-bold text-sm",
                    props.fieldTitle === "" && "hidden",
                )}
            >
                <Text>{props.fieldTitle}</Text>
            </BaseField.Label>
            <BaseField.Control
                type={props.type ?? "text"}
                placeholder={props.placeholder}
                value={props.value}
                onInput={(ev) => (props.value.value = ev.currentTarget.value)}
                className={cn(
                    "h-10 w-full rounded-md pl-sm outline outline-border transition-all focus:outline-2 focus:outline-muted focus:-outline-offset-1",
                    props.className,
                )}
            />
        </BaseField.Root>
    );
}
