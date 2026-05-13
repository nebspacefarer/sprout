import { Field as BaseField } from "@base-ui/react/field";
import type { Signal } from "@preact/signals";
import type { BaseHTMLAttributes } from "preact";
import Text from "./Text";

interface FieldProps extends BaseHTMLAttributes<HTMLBaseElement> {
    placeholder: string;
    fieldTitle: string;
    value: Signal<string>;
}

export default function Field(props: FieldProps) {
    return (
        <BaseField.Root className="flex flex-col items-start gap-1">
            <BaseField.Label className="font-bold text-sm">
                <Text>{props.fieldTitle}</Text>
            </BaseField.Label>
            <BaseField.Control
                placeholder={props.placeholder}
                value={props.value}
                onInput={(ev) => (props.value.value = ev.currentTarget.value)}
                className="h-10 w-full rounded-md pl-sm outline outline-surface transition-all focus:outline-2 focus:outline-muted focus:-outline-offset-1"
            />
        </BaseField.Root>
    );
}
