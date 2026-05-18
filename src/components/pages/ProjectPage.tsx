import { Separator } from "@base-ui/react";
import { useDeepSignal } from "@deepsignal/preact";
import { type Signal, useSignal } from "@preact/signals";
import {
    IconAdjustmentsCog,
    IconCheck,
    IconClockPlay,
    IconCodeVariablePlus,
    IconDots,
    IconEyeCheck,
    IconFlag,
    IconLayoutKanban,
    IconLayoutList,
    IconNote,
    IconSection,
    IconSortDescending2,
    IconTrashX,
} from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import { useParams } from "wouter";
import { cn } from "#utils/cn";
import type { Project, Task } from "#utils/types";
import EditTaskDialog from "../dialogs/EditTask";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Field from "../ui/Field";
import { MenuCheckbox, MenuCheckboxItem } from "../ui/MenuCheckbox";
import { MenuSelect, MenuSelectItem } from "../ui/MenuSelect";
import Show from "../ui/Show";
import Text from "../ui/Text";
import Toggle from "../ui/Toggle";
import ToggleGroup from "../ui/ToggleGroup";
import Toolbar from "../ui/Toolbar";

export default function ProjectPage() {
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
    const sort = useSignal<string>("createdAt");
    const addTask = useSignal<string>("");

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
            title: addTask.value,
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

                    <Toolbar>
                        <Field
                            fieldTitle="Search"
                            placeholder="Find task..."
                            value={search}
                            horizontal
                        />

                        <ToggleGroup defaultValue={["section"]}>
                            <Toggle value="section" title="Layout: Section">
                                <IconSection />
                            </Toggle>
                            <Toggle value="list" title="Layout: List">
                                <IconLayoutList />
                            </Toggle>
                            <Toggle value="kanban" title="Layout: Kanban">
                                <IconLayoutKanban />
                            </Toggle>
                        </ToggleGroup>

                        <MenuCheckbox menuTitle={<IconEyeCheck />}>
                            <MenuCheckboxItem checked={checked.assignees}>
                                <Text>Assignee(s)</Text>
                            </MenuCheckboxItem>
                            <MenuCheckboxItem checked={checked.dueAt}>
                                <Text>Due Date</Text>
                            </MenuCheckboxItem>
                            <MenuCheckboxItem checked={checked.priority}>
                                <Text>Priority</Text>
                            </MenuCheckboxItem>
                            <MenuCheckboxItem checked={checked.tags}>
                                <Text>Tag(s)</Text>
                            </MenuCheckboxItem>
                            <MenuCheckboxItem checked={checked.timetrack}>
                                <Text>Time Tracking</Text>
                            </MenuCheckboxItem>
                        </MenuCheckbox>

                        <MenuSelect menuPlaceholder={<IconSortDescending2 />}>
                            <MenuSelectItem
                                onClick={() => (sort.value = "createdAt")}
                                className={cn(
                                    sort.value === "createdAt" &&
                                    "text-foreground",
                                )}
                            >
                                Created Date
                            </MenuSelectItem>
                            <MenuSelectItem
                                onClick={() => (sort.value = "dueAt")}
                            >
                                Due Date
                            </MenuSelectItem>
                            <MenuSelectItem
                                onClick={() => (sort.value = "dueAt")}
                            >
                                Title
                            </MenuSelectItem>
                        </MenuSelect>
                    </Toolbar>

                    <div className="flex flex-col gap-xs">
                        <div className="flex items-center gap-xs py-sm">
                            <Field
                                fieldTitle=""
                                placeholder="Quick Add Task..."
                                value={addTask}
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

                        <div className="flex flex-col bg-crust">
                            <div className="w-full rounded-md bg-primary px-xs py-1 text-primary-foreground">
                                <Text className="font-semibold text-lg">
                                    Title
                                </Text>
                            </div>
                            <div>
                                {tasks.value?.map((task: Task) => (
                                    <SectionTask
                                        task={task}
                                        deleteTask={(id) => deleteTask(id)}
                                        taskDialogOpen={taskDialogOpen}
                                        editedTask={editedTask}
                                    />
                                ))}
                            </div>
                        </div>
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
