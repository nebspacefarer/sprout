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

            console.log(data);
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

        const result = await fetch("http://localhost:3536/api/tasks", {
            method: "POST",
            body: JSON.stringify(task),
        });

        const data = await result.json();

        console.log(data);

        projects[addTaskProjectField.value].tasks.value = [
            ...projects[addTaskProjectField.value].tasks.value,
            data.task,
        ];
    }

    async function deleteTask(task: Task) {
        const result = await fetch("http://localhost:3536/api/tasks", {
            method: "DELETE",
            body: JSON.stringify({ _id: task._id }),
        });

        const data = await result.json();

        if (data.result) {
            const projectIndex = projects.value.findIndex(
                (p) => p.project._id === task.projectId,
            );
            projects[projectIndex].tasks.value = [
                ...projects[projectIndex].tasks.value.filter(
                    (t: Task) => t._id !== task._id,
                ),
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
