import { useDeepSignal } from "@deepsignal/preact";
import type { Signal } from "@preact/signals";
import { IconClockPlay, IconFlag } from "@tabler/icons-preact";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import type { ProjectData, Task, TimeTrack } from "#utils/types";
import Button from "../ui/Button";
import DatePicker from "../ui/DatePicker";
import Dialog from "../ui/Dialog";
import Field from "../ui/Field";
import MarkdownEditor from "../ui/MarkdownEditor";
import { MenuSelect, MenuSelectItem } from "../ui/MenuSelect";
import Show from "../ui/Show";
import Text from "../ui/Text";

interface DialogProps extends BaseHTMLAttributes<HTMLBaseElement> {
    projectsSelected: Signal<ProjectData[]>;
    open: Signal<boolean>;
    dialogTrigger?: ComponentChildren;
    task: Signal<Task>;
}

export default function EditTaskDialog(props: DialogProps) {
    if (props.task.value !== null) {
        const dataTask = useDeepSignal({
            _id: props.task.value._id,
            title: props.task.value.title,
            content: props.task.value.content,
            createdAt: props.task.value.createdAt,
            dueAt: props.task.value.dueAt,
            priority: props.task.value.priority,
            status: props.task.value.status,
            timeTracking: props.task.value.timeTracking,
            userId: props.task.value.userId,
            projectId: props.task.value.projectId,
        });

        async function editTask() {
            const result = await fetch(`http://localhost:3536/api/tasks`, {
                method: "PUT",
                body: JSON.stringify(dataTask),
            });

            const data = await result.json();

            const projectIndex = props.projectsSelected.value.findIndex(
                (p) => p.project._id === props.task.value.projectId,
            );

            const projectData = props.projectsSelected.value.find(
                (p) => p.project._id,
            );

            projectData.tasks = [
                ...props.projectsSelected.value[projectIndex].tasks.filter(
                    (t) => t._id !== data.task._id,
                ),
                data.task,
            ];

            props.projectsSelected.value = [
                ...props.projectsSelected.value.filter(
                    (p) => p.project._id !== projectData.project._id,
                ),
                projectData,
            ];

            props.open.value = false;
        }

        return (
            <Dialog
                open={props.open}
                dialogTrigger={props.dialogTrigger}
                dialogAccept={
                    <Button onClick={() => editTask()}>Update</Button>
                }
                dialogTitle="Edit Task"
                className="w-2/3"
            >
                <div className="grid grid-cols-6 gap-sm">
                    <div className="col-span-4 flex flex-col gap-sm">
                        <Field
                            fieldTitle="Title"
                            placeholder="Buy eggs..."
                            value={dataTask.title}
                        />

                        <MarkdownEditor
                            editorTitle="Content"
                            placeholder="Write task content..."
                            value={dataTask.content}
                        />
                    </div>
                    <div className="col-span-2 flex flex-col gap-sm">
                        <MenuSelect
                            menuTitle="Created Date"
                            menuPlaceholder={
                                dataTask.createdAt.value !== undefined
                                    ? dataTask.createdAt
                                    : "Pick a date..."
                            }
                            className="w-full"
                        >
                            <DatePicker selected={dataTask.createdAt} />
                        </MenuSelect>

                        <MenuSelect
                            menuTitle="Due Date"
                            menuPlaceholder={
                                dataTask.dueAt.value !== undefined
                                    ? dataTask.dueAt
                                    : "Pick a date..."
                            }
                            className="w-full"
                        >
                            <DatePicker selected={dataTask.dueAt} />
                        </MenuSelect>

                        <MenuSelect
                            menuTitle="Priority"
                            menuPlaceholder={
                                <Text className="flex items-center gap-xs">
                                    <IconFlag /> {dataTask.priority.value}
                                </Text>
                            }
                            className="w-full"
                        >
                            <MenuSelectItem
                                onClick={() => (dataTask.priority.value = 0)}
                                className="flex items-center gap-xs hover:text-foreground active:text-foreground"
                            >
                                <IconFlag /> <Text>0</Text>
                            </MenuSelectItem>

                            <MenuSelectItem
                                onClick={() => (dataTask.priority.value = 1)}
                                className="flex items-center gap-xs hover:text-success active:text-success"
                            >
                                <IconFlag /> <Text>1</Text>
                            </MenuSelectItem>

                            <MenuSelectItem
                                onClick={() => (dataTask.priority.value = 2)}
                                className="flex items-center gap-xs hover:text-warning active:text-warning"
                            >
                                <IconFlag /> <Text>2</Text>
                            </MenuSelectItem>

                            <MenuSelectItem
                                onClick={() => (dataTask.priority.value = 3)}
                                className="flex items-center gap-xs hover:text-danger active:text-danger"
                            >
                                <IconFlag /> <Text>3</Text>
                            </MenuSelectItem>
                        </MenuSelect>

                        <div className="flex flex-col gap-xs">
                            <Text className="font-bold text-sm">
                                Time Tracking
                            </Text>

                            <Show
                                when={dataTask.timeTracking.value.length === 0}
                            >
                                <div className="text-muted">
                                    No time tracked.
                                </div>
                            </Show>

                            <Button className="flex items-center gap-xs border border-border bg-crust py-1 transition-all hover:scale-[105%] hover:border-muted">
                                <IconClockPlay className="text-success" />
                                <Text className="text-muted">00:00:00</Text>
                            </Button>

                            <div>
                                {dataTask.timeTracking.value.map(
                                    (timeTrack: TimeTrack) => (
                                        <div>
                                            {timeTrack.userId} -{" "}
                                            {timeTrack.sessions}
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}
