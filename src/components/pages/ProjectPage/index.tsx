import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { useParams } from "wouter";
import Show from "#ui/Show";
import type { Project, Task } from "#utils/types";
import ProjectToolbar from "./ProjectTopbar";

export default function ProjectPage() {
    const params = useParams<{ name: string }>();
    const project = useSignal<Project>(null);
    const tasks = useSignal<Task[]>([]);

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

    return (
        <div>
            <Show when={project.value !== null}>
                <ProjectToolbar project={project} />
            </Show>
        </div>
    );
}
