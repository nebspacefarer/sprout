import { Separator } from "@base-ui/react";
import { useSignal } from "@preact/signals";
import { IconListDetails, IconNote } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import { useParams } from "wouter";
import Button from "#ui/Button";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import type { Note, Project, Task } from "#utils/types";
import NotesListing from "./NotesListing";
import ProjectToolbar from "./ProjectTopbar";
import TasksListing from "./TasksListing";

export default function ProjectPage() {
    const params = useParams<{ name: string }>();
    const project = useSignal<Project>(null);
    const tasks = useSignal<Task[]>([]);
    const notes = useSignal<Note[]>([]);

    useEffect(() => {
        async function getProject() {
            const result = await fetch(
                `http://localhost:3536/api/projects/${params.name}`,
            );
            const data = await result.json();

            project.value = data.project;
            tasks.value = data.tasks;
            notes.value = data.notes;
        }

        getProject();
    }, []);

    return (
        <div>
            <Show when={project.value !== null}>
                <div className="flex flex-col gap-xs">
                    <ProjectToolbar project={project} />

                    <div className="flex gap-sm">
                        <Card className="flex-1" orientation="col">
                            <div className="flex w-full items-center justify-between">
                                <Text className="flex items-center gap-xs font-bold text-xl">
                                    <IconListDetails /> Tasks
                                </Text>

                                <Button>See all tasks</Button>
                            </div>

                            <Separator
                                orientation="horizontal"
                                className="h-px w-full bg-border"
                            />

                            <TasksListing tasks={tasks} project={project} />
                        </Card>

                        <Card className="flex-1" orientation="col">
                            <div className="flex w-full items-center justify-between">
                                <Text className="flex items-center gap-xs font-bold text-xl">
                                    <IconNote /> Notes
                                </Text>
                                <Button>See all notes</Button>
                            </div>

                            <Separator
                                orientation="horizontal"
                                className="h-px w-full bg-border"
                            />

                            <NotesListing project={project} notes={notes} />
                        </Card>
                    </div>
                </div>
            </Show>
        </div>
    );
}
