import type { Signal } from "@preact/signals";
import {
    IconCheck,
    IconClockPlay,
    IconDots,
    IconFlag,
    IconNote,
    IconTrashX,
} from "@tabler/icons-preact";
import Button from "#ui/Button";
import Card from "#ui/Card";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { cn } from "#utils/cn";
import type { Task } from "#utils/types";

export default function TasksListing({
    layout,
    tasks,
    deleteTask,
    taskDialogOpen,
    editedTask,
}: {
    layout: Signal<string>;
    tasks: Signal<Task[]>;
    deleteTask: (_id: string) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}) {
    return (
        <div className="flex flex-col bg-crust">
            <div className="w-full rounded-md bg-primary px-xs py-1 text-primary-foreground">
                <Text className="font-semibold text-lg">Title</Text>
            </div>
            <div>
                {tasks.value?.map((task: Task) => {
                    switch (layout.value) {
                        default:
                            return (
                                <SectionTask
                                    task={task}
                                    deleteTask={(id) => deleteTask(id)}
                                    taskDialogOpen={taskDialogOpen}
                                    editedTask={editedTask}
                                />
                            );
                    }
                })}
            </div>
        </div>
    );
}

function SectionTask({
    task,
    deleteTask,
    taskDialogOpen,
    editedTask,
}: {
    task: Task;
    deleteTask: (_id: string) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}) {
    function editTask() {
        editedTask.value = task;
        taskDialogOpen.value = true;
    }

    return (
        <Card className="justify-between bg-surface font-semibold" small>
            <div className="flex w-full gap-xs">
                <Button className="bg-unset text-muted hover:text-success">
                    <IconCheck />
                </Button>

                <Button
                    className="group flex flex-1 flex-col items-start gap-1 bg-unset text-unset"
                    onClick={() => editTask()}
                >
                    <div className="flex items-center gap-xs">
                        <Text className="border-surface border-b transition-all group-hover:border-primary">
                            {task.title}
                        </Text>
                        <Show when={task.content !== undefined}>
                            <IconNote
                                className="text-muted"
                                title="Read more..."
                            />
                        </Show>
                        <Show when={task.dueAt !== undefined}>
                            <Text className="text-sm">
                                Due Date: {task.dueAt}
                            </Text>
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
                    </div>

                    <div className="flex items-center gap-sm text-sm">
                        <Text>Created by: {task.userId}</Text>
                        <Show when={task.assigneesId !== undefined}>
                            <Text>
                                Assignee(s): {task.assigneesId?.join(", ")}
                            </Text>
                        </Show>
                    </div>
                </Button>
            </div>

            <div className="flex items-center gap-sm">
                <Button className="flex items-center gap-xs border-border bg-crust py-1 transition-all hover:scale-[110%] hover:border-muted">
                    <IconClockPlay className="text-success" />{" "}
                    <Text className="text-muted">00:00:00</Text>
                </Button>

                <MenuSelect menuPlaceholder={<IconDots />}>
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
