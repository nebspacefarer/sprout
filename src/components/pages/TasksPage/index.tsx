import { Toast } from "@base-ui/react";
import { useDeepSignal } from "@deepsignal/preact";
import { useSignal } from "@preact/signals";
import { IconListDetails } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import PageTitle from "src/components/PageTitle";
import { useSearch } from "wouter";
import type { ProjectData, Task } from "#utils/types";
import EditTaskDialog from "../../dialogs/EditTask";
import TasksListing from "./TasksListing";
import TasksQuickAddBar from "./TasksQuickAddBar";
import TasksToolbar from "./TasksToolbar";

export default function TasksPage() {
    const toastManager = Toast.useToastManager();
    const _searchUrl = useSearch();
    const projects = useSignal<ProjectData[]>([]);

    const projectsSelected = useSignal<ProjectData[]>([]);
    const search = useSignal<string>("");
    const checkedFields = useDeepSignal({
        assignees: true,
        dueAt: true,
        priority: true,
        tags: true,
        timetrack: true,
    });
    const layout = useSignal<string>("section");
    const sort = useSignal<string>("createdAt");
    const addTaskProjectField = useSignal<string>("");
    const addTaskField = useSignal<string>("");

    const taskDialogOpen = useSignal<boolean>(false);
    const editedTask = useSignal<Task>(null);

    useEffect(() => {
        async function getProjects() {
            const result = await fetch(`http://localhost:3536/api/projects`);
            const data = await result.json();

            projects.value = data.projects;
            projectsSelected.value = [...data.projects];
        }

        getProjects();
    }, []);

    async function createQuickTask() {
        const task: Task = {
            title: addTaskField.value,
            projectId: addTaskProjectField.value,
            userId: "0",
            priority: 1,
            status: 0,
            timeTracking: [],
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

        const result = await fetch("http://localhost:3536/api/tasks", {
            method: "POST",
            body: JSON.stringify(task),
        });

        const data = await result.json();

        const project = projects.value.find(
            (p) => p.project._id === addTaskProjectField.value,
        );

        project.tasks = [...project.tasks, data.task];

        if (
            projectsSelected.value.find(
                (p) => p.project._id === project.project._id,
            )
        ) {
            projectsSelected.value = [
                ...projectsSelected.value.filter(
                    (p) => p.project._id !== project.project._id,
                ),
                project,
            ];
        }

        toastManager.add({
            description: "Task created successfully",
        });
    }

    async function deleteTask(task: Task) {
        const result = await fetch("http://localhost:3536/api/tasks", {
            method: "DELETE",
            body: JSON.stringify({ _id: task._id }),
        });

        const data = await result.json();

        if (data.result) {
            const project = projectsSelected.value.find(
                (p) => p.project._id === task.projectId,
            );

            project.tasks = [
                ...project.tasks.filter((t) => t._id !== task._id),
            ];

            projectsSelected.value = [
                ...projectsSelected.value.filter(
                    (p) => p.project._id !== project.project._id,
                ),
                project,
            ];
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-sm">
                <PageTitle pageIcon={<IconListDetails />} pageTitle="Tasks" />

                <TasksToolbar
                    projectsSelected={projectsSelected}
                    projects={projects}
                    search={search}
                    checkedFields={checkedFields}
                    sort={sort}
                />

                <div className="flex flex-col gap-xs">
                    <TasksQuickAddBar
                        projects={projects}
                        addTaskProjectField={addTaskProjectField}
                        addTaskField={addTaskField}
                        createQuickTask={createQuickTask}
                    />

                    <TasksListing
                        layout={layout}
                        projectsSelected={projectsSelected}
                        taskDialogOpen={taskDialogOpen}
                        deleteTask={deleteTask}
                        editedTask={editedTask}
                    />
                </div>
            </div>

            <EditTaskDialog
                open={taskDialogOpen}
                projectsSelected={projectsSelected}
                task={editedTask}
            />
        </div>
    );
}
