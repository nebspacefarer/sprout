import type { Signal } from "@preact/signals";
import { IconCodeVariablePlus } from "@tabler/icons-preact";
import Button from "#ui/Button";
import Field from "#ui/Field";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Text from "#ui/Text";
import type { ProjectData } from "#utils/types";

export default function TasksQuickAddBar({
    projects,
    addTaskField,
    addTaskProjectField,
    createQuickTask,
}: {
    projects: Signal<ProjectData[]>;
    addTaskField: Signal<string>;
    addTaskProjectField: Signal<string>;
    createQuickTask: () => void;
}) {
    return (
        <div className="flex flex-col gap-xs">
            <div className="flex items-center gap-xs py-sm">
                <MenuSelect menuPlaceholder="Project target">
                    {projects.value?.map((project: ProjectData) => (
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
