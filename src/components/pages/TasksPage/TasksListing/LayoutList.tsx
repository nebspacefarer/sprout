import type { Signal } from "@preact/signals";
import {
    IconCheck,
    IconClockPlay,
    IconDots,
    IconEdit,
    IconFlag,
    IconNote,
    IconTrashX,
} from "@tabler/icons-preact";
import Avatar from "#ui/Avatar";
import Button from "#ui/Button";
import Card from "#ui/Card";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Show from "#ui/Show";
import Tag from "#ui/Tag";
import Text from "#ui/Text";
import { cn } from "#utils/cn";
import { taskStatuses } from "#utils/status";
import { toFallback } from "#utils/strings";
import type { ProjectData, Task } from "#utils/types";

export default function LayoutList({
    projectsSelected,
    layout,
    tasks,
    deleteTask,
    taskDialogOpen,
    editedTask,
}: {
    projectsSelected: Signal<ProjectData[]>;
    layout: Signal<string[]>;
    tasks: Signal<Task[]>;
    deleteTask: (task: Task) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}) {
    return (
        <div>
            {tasks.value.map((task: Task) => {
                switch (layout.value) {
                    default:
                        return (
                            <ListTask
                                projectsSelected={projectsSelected}
                                task={task}
                                deleteTask={() => deleteTask(task)}
                                taskDialogOpen={taskDialogOpen}
                                editedTask={editedTask}
                            />
                        );
                }
            })}
        </div>
    );
}

function ListTask({
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
    function editTask() {
        editedTask.value = task;
        taskDialogOpen.value = true;
    }

    const projectData = projectsSelected.value.find(
        (p) => p.project._id === task.projectId,
    );

    return (
        <Card className="justify-between bg-surface font-semibold" small>
            <div className="flex items-center gap-xs">
                <Button className="bg-unset text-muted hover:text-success">
                    <IconCheck />
                </Button>

                <Button
                    className="group flex flex-1 items-center gap-sm bg-unset text-unset"
                    onClick={() => editTask()}
                >
                    <Text
                        className="text-sm uppercase"
                        style={{ color: taskStatuses[task.status].color }}
                    >
                        {taskStatuses[task.status].title}
                    </Text>

                    <Show when={projectsSelected.value.length > 1}>
                        <Text className="text-muted">
                            {projectData.project.title}
                        </Text>
                    </Show>

                    <Text className="border-surface border-b transition-all group-hover:border-primary">
                        {task.title}
                    </Text>

                    <Show when={task.content !== undefined}>
                        <IconNote className="text-muted" title="Read more..." />
                    </Show>

                    <Show when={task.dueAt !== undefined}>
                        <Text className="text-sm">Due Date: {task.dueAt}</Text>
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
