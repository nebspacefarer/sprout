import { Separator } from "@base-ui/react";
import { IconListDetails, IconNote } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import { useParams } from "wouter";
import Button from "#ui/Button";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { getProjectByIdOrName } from "#utils/fetch";
import { useStore } from "#utils/store";
import NotesListing from "./NotesListing";
import ProjectToolbar from "./ProjectTopbar";
import TasksListing from "./TasksListing";

export default function ProjectPage() {
    const store = useStore();
    const params = useParams<{ name: string }>();

    useEffect(() => {
        async function init() {
            const data = await getProjectByIdOrName(params.name);

            store.project = data.project;
            store.tasks = data.tasks;
            store.notes = data.notes;
        }

        init();
    }, []);

    return (
        <div>
            <Show when={store.project !== null}>
                <div className="flex flex-col gap-xs">
                    <ProjectToolbar />

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

                            <TasksListing />
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

                            <NotesListing />
                        </Card>
                    </div>
                </div>
            </Show>
        </div>
    );
}
