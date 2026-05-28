import { Toast } from "@base-ui/react";
import { useDeepSignal } from "@deepsignal/preact";
import { useSignal } from "@preact/signals";
import { IconListDetails } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import Page from "src/components/Page";
import { useSearch } from "wouter";
import Scroll from "#ui/Scroll";
import { deleteTask, getProjects, postTask } from "#utils/fetch";
import { useStore } from "#utils/store";
import type { ProjectData, Task } from "#utils/types";
import EditTaskDialog from "../../dialogs/EditTask";
import TasksListing from "./TasksListing";
import TasksQuickAddBar from "./TasksQuickAddBar";
import TasksToolbar from "./TasksToolbar";

export default function TasksPage() {
    const store = useStore();
    const toastManager = Toast.useToastManager();

    const _searchUrl = useSearch();

    const projectsSelected = useSignal<ProjectData[]>([]);
    const search = useSignal<string>("");
    const checkedFields = useDeepSignal({
        assignees: true,
        dueAt: true,
        priority: true,
        tags: true,
        timetrack: true,
    });
    const layout = useSignal<string[]>(["section"]);
    const sort = useSignal<string>("createdAt");
    const addTaskProjectField = useSignal<string>("");
    const addTaskField = useSignal<string>("");

    const taskDialogOpen = useSignal<boolean>(false);
    const editedTask = useSignal<Task>(null);

    useEffect(() => {
        async function init() {
            const data = await getProjects();

            store.projects = data.projects;
            projectsSelected.value = [...data.projects];
        }

        init();
    }, []);

    async function createQuickTask() {
        const task: Task = {
            title: addTaskField.value,
            projectId: addTaskProjectField.value,
            userId: "0",
            priority: 1,
            status: 0,
            timeTracking: [],
            assigneesId: ["0"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (task.title.length === 0) {
            return toastManager.add({
                title: "An error occured",
                description: "Please enter a task title first.",
                type: "error",
            });
        }
        if (task.projectId.length === 0) {
            return toastManager.add({
                title: "An error occured",
                description:
                    "Please select a Project Target to add the task to.",
                type: "error",
            });
        }

        const data = await postTask(task);

        const project = store.projects.find(
            (p) => p.project._id === data.task.projectId,
        );

        project.tasks = [...project.tasks, data.task];

        projectsSelected.value = [
            ...projectsSelected.value.filter(
                (p) => p.project._id !== data.task.projectId,
            ),
            project,
        ];

        toastManager.add({
            description: "Task created successfully!",
        });
    }

    async function runDeleteTask(task: Task) {
        const data = await deleteTask(task);

        if (data.err) {
            toastManager.add({
                title: "An error occured",
                description: data.err,
                type: "error",
            });
        }

        const project = projectsSelected.value.find(
            (p) => p.project._id === task.projectId,
        );

        project.tasks = [...project.tasks.filter((t) => t._id !== task._id)];

        projectsSelected.value = [
            ...projectsSelected.value.filter(
                (p) => p.project._id !== project.project._id,
            ),
            project,
        ];
    }

    return (
        <Page auth pageIcon={<IconListDetails />} pageTitle="Tasks">
            <TasksToolbar
                projectsSelected={projectsSelected}
                search={search}
                checkedFields={checkedFields}
                sort={sort}
                layout={layout}
            />

            <div className="flex flex-col gap-xs">
                <TasksQuickAddBar
                    addTaskProjectField={addTaskProjectField}
                    addTaskField={addTaskField}
                    createQuickTask={createQuickTask}
                />

                <Scroll className="h-[60vh]">
                    <TasksListing
                        layout={layout}
                        projectsSelected={projectsSelected}
                        taskDialogOpen={taskDialogOpen}
                        deleteTask={runDeleteTask}
                        editedTask={editedTask}
                    />
                </Scroll>
            </div>

            <EditTaskDialog
                open={taskDialogOpen}
                projectsSelected={projectsSelected}
                task={editedTask}
            />
        </Page>
    );
}
