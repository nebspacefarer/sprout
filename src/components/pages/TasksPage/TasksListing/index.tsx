import type { Signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { taskStatuses } from "#utils/status";
import { useStore } from "#utils/store";
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
    const store = useStore();

    useEffect(() => {
        function getTasks() {
            store.tasks = [];
            for (const projectData of projectsSelected.value) {
                store.tasks = [...store.tasks, ...projectData.tasks];
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
                    layout={layout}
                    deleteTask={deleteTask}
                    editedTask={editedTask}
                    taskDialogOpen={taskDialogOpen}
                />
            )}
        </div>
    );
}
