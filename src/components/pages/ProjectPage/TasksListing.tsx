import type { Signal } from "@preact/signals";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import type { Project, Task } from "#utils/types";

export default function TasksListing({
    tasks,
    project,
}: {
    tasks: Signal<Task[]>;
    project: Signal<Project>;
}) {
    return (
        <div className="flex w-full flex-col gap-xs">
            {tasks.value.map((task: Task) => (
                <Card
                    className="flex items-center justify-between bg-surface"
                    small
                >
                    <div className="flex items-center gap-sm">
                        <Text className="text-sm">{task.status}</Text>
                        <Text className="font-semibold">{task.title}</Text>
                    </div>
                    <div className="flex items-center gap-sm">
                        <Text>{task.assigneesId?.join(", ")}</Text>
                        <Show when={task.dueAt !== undefined}>
                            <Text>Due: {task.dueAt}</Text>
                        </Show>
                    </div>
                </Card>
            ))}

            <Show when={tasks.value.length === 0}>
                <Text className="text-muted">
                    No task found for {project.value?.title}.
                </Text>
            </Show>
        </div>
    );
}
