import type { Signal } from "@preact/signals";
import { IconCodeVariablePlus } from "@tabler/icons-preact";
import Button from "#ui/Button";
import Field from "#ui/Field";
import Text from "#ui/Text";
import Toolbar from "#ui/Toolbar";

export default function EntryQuickAddBar({
    entry,
    addEntry,
}: {
    entry: Signal<string>;
    addEntry: () => void;
}) {
    return (
        <Toolbar>
            <Field
                fieldTitle="Create Entry"
                placeholder="Enter task/reminder..."
                value={entry}
                className="w-[500px]"
                horizontal
            />
            <Button
                onClick={() => addEntry()}
                className="flex h-10 items-center gap-xs"
            >
                <IconCodeVariablePlus />
                <Text>Add</Text>
            </Button>
        </Toolbar>
    );
}
