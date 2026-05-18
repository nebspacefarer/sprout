import { Separator } from "@base-ui/react";
import { useDeepSignal } from "@deepsignal/preact";
import { useSignal } from "@preact/signals";
import { IconAdjustmentsCog } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import { useParams } from "wouter";
import type { Project, Task } from "#utils/types";
import EditTaskDialog from "../../dialogs/EditTask";
import Avatar from "../../ui/Avatar";
import Button from "../../ui/Button";
import Show from "../../ui/Show";
import Text from "../../ui/Text";
import TasksListing from "./TasksListing";
import TasksQuickAddBar from "./TasksQuickAddBar";
import TasksToolbar from "./TasksToolbar";

export default function TasksPage() {
    const params = useParams<{ name: string }>();
    const project = useSignal<Project | null>(null);
    const tasks = useSignal<Task[]>([]);

    const search = useSignal<string>("");
    const checked = useDeepSignal({
        assignees: true,
        dueAt: true,
        priority: true,
        tags: true,
        timetrack: true,
    });
    const layout = useSignal<string>("section");
    const sort = useSignal<string>("createdAt");
    const addTaskField = useSignal<string>("");

    const taskDialogOpen = useSignal<boolean>(false);
    const editedTask = useSignal<Task>(null);

    useEffect(() => {
        async function getProject() {
            const result = await fetch(
                `http://localhost:3536/api/projects/${params.name}`,
            );
            const data = await result.json();

            project.value = data.project;
            tasks.value = data.tasks;

            console.log(data.tasks);
        }

        getProject();
    }, []);

    async function createQuickTask() {
        const task: Task = {
            title: addTaskField.value,
            projectId: project.value._id,
            userId: "0",
            priority: 1,
            status: 0,
            timeTracking: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const result = await fetch("http://localhost:3536/api/tasks", {
            method: "POST",
            body: JSON.stringify(task),
        });

        const data = await result.json();

        console.log(data);

        tasks.value = [...tasks.value, data.task];
    }

    async function deleteTask(_id: string) {
        const result = await fetch("http://localhost:3536/api/tasks", {
            method: "DELETE",
            body: JSON.stringify({ _id: _id }),
        });

        const data = await result.json();

        if (data.result) {
            tasks.value = [...tasks.value.filter((task) => task._id !== _id)];
        }
    }

    return (
        <div>
            <Show when={project.value !== null}>
                <div className="flex flex-col gap-sm">
                    <div className="flex items-center justify-between gap-sm">
                        <div className="flex items-center gap-xs">
                            <Avatar
                                src={project.value?.icon}
                                fallback={project.value?.title}
                                className="size-16"
                            />
                            <Text className="border-primary border-b-3 font-semibold text-2xl">
                                {project.value?.title}
                            </Text>
                            <Text>{project.value?.desc}</Text>
                        </div>

                        <Button className="size-10">
                            <IconAdjustmentsCog size={20} />
                        </Button>
                    </div>

                    <Separator
                        orientation="horizontal"
                        className="h-px bg-border"
                    />

                    <TasksToolbar
                        search={search}
                        checked={checked}
                        sort={sort}
                    />

                    <div className="flex flex-col gap-xs">
                        <TasksQuickAddBar
                            addTaskField={addTaskField}
                            createQuickTask={createQuickTask}
                        />

                        <TasksListing
                            layout={layout}
                            tasks={tasks}
                            taskDialogOpen={taskDialogOpen}
                            deleteTask={deleteTask}
                            editedTask={editedTask}
                        />
                    </div>
                </div>

                <EditTaskDialog
                    open={taskDialogOpen}
                    task={editedTask}
                    tasks={tasks}
                />
            </Show>
        </div>
    );
}
