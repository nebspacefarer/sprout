import type { Signal } from "@preact/signals";
import { IconCalendarExclamation } from "@tabler/icons-preact";
import { format, formatDistance } from "date-fns";
import Avatar from "#ui/Avatar";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { taskStatuses } from "#utils/status";
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
                        <Text
                            className="text-sm uppercase"
                            style={{ color: taskStatuses[task.status].color }}
                        >
                            {taskStatuses[task.status].title}
                        </Text>
                        <Text className="font-semibold">{task.title}</Text>
                    </div>

                    <div className="flex items-center gap-sm">
                        {task.assignees?.map((a) => (
                            <Avatar src={a.avatar} fallback={a.username} />
                        ))}

                        <Show when={task.dueAt !== undefined}>
                            <div
                                className="flex items-center gap-1"
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
