import type { Signal } from "@preact/signals";
import { IconCodeVariablePlus } from "@tabler/icons-preact";
import Button from "#ui/Button";
import Field from "#ui/Field";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Text from "#ui/Text";
import { useStore } from "#utils/store";
import type { ProjectData } from "#utils/types";

export default function TasksQuickAddBar({
    addTaskField,
    addTaskProjectField,
    createQuickTask,
}: {
    addTaskField: Signal<string>;
    addTaskProjectField: Signal<string>;
    createQuickTask: () => void;
}) {
    const store = useStore();

    return (
        <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs py-sm">
                <MenuSelect menuPlaceholder="Project target">
                    {store.projects.map((project: ProjectData) => (
                        <MenuSelectItem
                            onClick={() =>
                            (addTaskProjectField.value =
                                project.project._id)
                            }
                        >
                            {project.project.title}
                        </MenuSelectItem>
                    ))}
                </MenuSelect>

                <Text>
                    {addTaskProjectField.value &&
                        "in: " +
                        store.projects.find(
                            (p: ProjectData) =>
                                p.project._id === addTaskProjectField.value,
                        ).project.title}
                </Text>

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
