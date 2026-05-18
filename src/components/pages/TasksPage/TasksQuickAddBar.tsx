import { IconCodeVariablePlus } from "@tabler/icons-preact";
import Button from "#ui/Button";
import Field from "#ui/Field";
import Text from "#ui/Text";

export default function TasksQuickAddBar({ addTaskField, createQuickTask }) {
    return (
        <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs py-sm">
                <Field
                    fieldTitle=""
                    placeholder="Quick Add Task..."
                    value={addTaskField}
                    className="w-[500px]"
                />
                <Button
                    className="h-10 gap-xs text-sm"
                    onClick={() => createQuickTask()}
                >
                    <IconCodeVariablePlus />
                    <Text>Add Task</Text>
                </Button>
            </div>
        </div>
    );
}
