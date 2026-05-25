import { type Signal, useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { taskStatuses } from "#utils/status";
import type { ProjectData, Task } from "#utils/types";
import LayoutList from "./LayoutList";
import LayoutSection from "./LayoutSection";

export default function TasksListing({
    layout,
    projectsSelected,
    deleteTask,
    taskDialogOpen,
    editedTask,
}: {
    layout: Signal<string[]>;
    projectsSelected: Signal<ProjectData[]>;
    deleteTask: (task: Task) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}) {
    const tasks = useSignal<Task[]>([]);

    useEffect(() => {
        function getTasks() {
            tasks.value = [];

            for (const projectData of projectsSelected.value) {
                tasks.value = [...tasks.value, ...projectData.tasks];
            }
        }
        getTasks();
    }, [projectsSelected.value]);

    return (
        <div className="flex flex-col gap-sm bg-crust">
            {layout.value.includes("section") &&
                taskStatuses.map(
                    (s) =>
                        layout.value.includes("section") && (
                            <LayoutSection
                                projectsSelected={projectsSelected}
                                status={s}
                                tasks={tasks}
                                layout={layout}
                                deleteTask={deleteTask}
                                editedTask={editedTask}
                                taskDialogOpen={taskDialogOpen}
                            />
                        ),
                )}

            {layout.value.includes("list") && (
                <LayoutList
                    projectsSelected={projectsSelected}
                    tasks={tasks}
                    layout={layout}
                    deleteTask={deleteTask}
                    editedTask={editedTask}
                    taskDialogOpen={taskDialogOpen}
                />
            )}
        </div>
    );
}
