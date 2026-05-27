import type { Signal } from "@preact/signals";
import {
    IconCalendarExclamation,
    IconCheck,
    IconClockPlay,
    IconDots,
    IconEdit,
    IconFlag,
    IconNote,
    IconTrashX,
} from "@tabler/icons-preact";
import { format, formatDistance } from "date-fns";
import Avatar from "#ui/Avatar";
import Button from "#ui/Button";
import Card from "#ui/Card";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Show from "#ui/Show";
import Tag from "#ui/Tag";
import Text from "#ui/Text";
import { cn } from "#utils/cn";
import { useStore } from "#utils/store";
import { toFallback } from "#utils/strings";
import type { ProjectData, Status, Task } from "#utils/types";
import TaskContextMenu from "./TaskContextMenu";
import { updateTask } from "#utils/fetch";

export default function LayoutSection({
    projectsSelected,
    status,
    layout,
    deleteTask,
    taskDialogOpen,
    editedTask,
}: {
    projectsSelected: Signal<ProjectData[]>;
    status: Status;
    layout: Signal<string[]>;
    deleteTask: (task: Task) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}) {
    const store = useStore();

    return (
        <div>
            <div
                className="w-full rounded-md px-xs py-1 text-primary-foreground"
                style={{ backgroundColor: status.color }}
            >
                <Text className="font-semibold text-lg">{status.title}</Text>
            </div>
            <div>
                {store.tasks
                    .filter((t) => t.status === status.id)
                    .map((task: Task) => {
                        switch (layout.value) {
                            default:
                                return (
                                    <TaskContextMenu
                                        trigger={
                                            <SectionTask
                                                projectsSelected={
                                                    projectsSelected
                                                }
                                                task={task}
                                                deleteTask={() =>
                                                    deleteTask(task)
                                                }
                                                taskDialogOpen={taskDialogOpen}
                                                editedTask={editedTask}
                                            />
                                        }
                                        deleteTask={() => deleteTask(task)}
                                        task={task}
                                        editedTask={editedTask}
                                        projectsSelected={projectsSelected}
                                        taskDialogOpen={taskDialogOpen}
                                    />
                                );
                        }
                    })}
            </div>
        </div>
    );
}

function SectionTask({
    projectsSelected,
    task,
    deleteTask,
    taskDialogOpen,
    editedTask,
}: {
    projectsSelected: Signal<ProjectData[]>;
    task: Task;
    deleteTask: (_id: string) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}) {
    const store = useStore();

    function editTask() {
        editedTask.value = task;
        taskDialogOpen.value = true;
    }

    async function changeStatus(newId: number, task: Task) {
        task.status = newId;

        const data = await updateTask(task);

        store.tasks = [
            ...store.tasks.filter((t) => t._id !== data.task._id),
            data.task,
        ];
    }

    const projectData = projectsSelected.value.find(
        (p) => p.project._id === task.projectId,
    );

    return (
        <Card className="w-full justify-between bg-surface font-semibold" small>
            <div className="flex w-full gap-xs">
                <Show when={task.status !== 5}>
                    <Button
                        className="bg-unset text-muted hover:text-success"
                        onClick={() => changeStatus(5, task)}
                    >
                        <IconCheck />
                    </Button>
                </Show>

                <Show when={task.status === 5}>
                    <IconCheck className="mx-xs text-success" />
                </Show>

                <Button
                    className="group flex flex-1 flex-col items-start gap-1 bg-unset text-unset"
                    onClick={() => editTask()}
                >
                    <div className="flex items-center gap-xs">
                        <Show when={projectsSelected.value.length > 1}>
                            <Text className="text-muted">
                                {projectData?.project.title}
                            </Text>
                        </Show>

                        <Text className="border-surface border-b text-normal transition-all group-hover:border-primary">
                            {task.title}
                        </Text>

                        <Show when={task.content !== undefined}>
                            <IconNote
                                className="text-muted"
                                title="Read more..."
                            />
                        </Show>

                        <Show when={task.dueAt !== undefined}>
                            {task.dueAt !== undefined && (
                                <div
                                    className="flex items-center gap-1 px-xs text-sm"
                                    title={
                                        "Due: " +
                                        format(task.dueAt, "MM/dd/yyyy HH:mm")
                                    }
                                >
                                    <IconCalendarExclamation />
                                    <Text>
                                        {formatDistance(new Date(), task.dueAt)}
                                    </Text>
                                </div>
                            )}
                        </Show>

                        <IconFlag
                            size={16}
                            className={cn(
                                task.priority === 0 && "text-muted",
                                task.priority === 1 && "text-success",
                                task.priority === 2 && "text-warning",
                                task.priority === 3 && "text-danger",
                            )}
                            title={`Priority ${task.priority}`}
                        />

                        <div className="flex items-center gap-xs">
                            {task.tags?.map((tag) => (
                                <Tag className="border border-border bg-crust">
                                    #{tag.name}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </Button>
            </div>

            <div className="flex items-center gap-sm">
                <div className="flex items-center gap-xs px-sm">
                    <Show when={task.assignees !== undefined}>
                        {task.assignees.map((a) => (
                            <Avatar
                                src={a.avatar}
                                fallback={toFallback(a.username)}
                            />
                        ))}
                    </Show>
                </div>

                <Button className="flex items-center gap-xs border-border bg-crust py-1 transition-all hover:scale-[110%] hover:border-muted">
                    <IconClockPlay className="text-success" />{" "}
                    <Text className="text-muted">00:00:00</Text>
                </Button>

                <MenuSelect menuPlaceholder={<IconDots />}>
                    <MenuSelectItem
                        onClick={() => editTask()}
                        className="flex items-center gap-xs"
                    >
                        <IconEdit /> <Text>Edit</Text>
                    </MenuSelectItem>

                    <MenuSelectItem
                        onClick={() => deleteTask(task._id)}
                        className="flex items-center gap-xs"
                    >
                        <IconTrashX /> <Text>Remove</Text>
                    </MenuSelectItem>
                </MenuSelect>
            </div>
        </Card>
    );
}
