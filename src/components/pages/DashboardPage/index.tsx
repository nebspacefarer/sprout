import { Separator } from "@base-ui/react";
import { useSignal } from "@preact/signals";
import {
    IconButterfly,
    IconClockPause,
    IconDashboard,
    IconListDetails,
    IconNote,
} from "@tabler/icons-preact";
import { format } from "date-fns";
import { useEffect } from "preact/hooks";
import Page from "src/components/Page";
import Avatar from "#ui/Avatar";
import Button from "#ui/Button";
import Card from "#ui/Card";
import Link from "#ui/Link";
import Scroll from "#ui/Scroll";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { getProjects, getTasks } from "#utils/fetch";
import { useStore } from "#utils/store";
import type { PublicUser } from "#utils/types";
import ProjectsListing from "./ProjectsListing";
import TasksListing from "./TasksListing";

export default function DashboardPage() {
    const store = useStore();

    const user = useSignal<PublicUser | null>(
        JSON.parse(localStorage.getItem("user")),
    );

    useEffect(() => {
        async function init() {
            const dataTasks = await getTasks();
            const dataProjects = await getProjects();

            store.tasks = dataTasks.tasks;
            store.projects = dataProjects.projects;
        }

        init();
    }, []);

    return (
        <Page pageTitle="Dashboard" pageIcon={<IconDashboard />} auth>
            <Card className="flex-col justify-center">
                <div className="flex items-center gap-xs font-semibold text-xl">
                    <IconButterfly size={32} />
                    <Text className="italic">Welcome back,</Text>
                    <div className="flex items-center gap-xs">
                        <Show when={user.value.avatar !== undefined}>
                            <Avatar
                                className="size-12"
                                src={user.value.avatar}
                                fallback=""
                            />
                        </Show>

                        <Text className="border-primary border-b-3 font-bold">
                            {user.value.username}
                        </Text>
                    </div>
                </div>

                <Text className="font-semibold text-lg italic">
                    {format(new Date(), " EEEE do, MMMM yyyy")}
                </Text>
            </Card>

            <div className="flex gap-sm">
                <Card className="flex-1" orientation="col">
                    <div className="flex w-full items-center justify-between">
                        <Text className="flex items-center gap-xs font-bold text-xl">
                            <IconListDetails /> Tasks Due
                        </Text>

                        <Button>See all tasks</Button>
                    </div>

                    <Separator
                        orientation="horizontal"
                        className="h-px w-full bg-border"
                    />

                    <Scroll className="h-[18vh] w-[38vw]">
                        <TasksListing />
                    </Scroll>
                </Card>

                <Card className="flex-1" orientation="col">
                    <div className="flex w-full items-center justify-between">
                        <Text className="flex items-center gap-xs font-bold text-xl">
                            <IconNote /> Your Projects
                        </Text>
                        <Button>
                            <Link href="/projects" className="hover:text-muted">
                                See all projects
                            </Link>
                        </Button>
                    </div>

                    <Separator
                        orientation="horizontal"
                        className="h-px w-full bg-border"
                    />

                    <Scroll className="h-[18vh] w-[38vw]">
                        <ProjectsListing />
                    </Scroll>
                </Card>
            </div>

            <Card className="justify-center">
                <div className="flex flex-1 flex-col items-center gap-sm">
                    <div className="flex items-center gap-xs text-center font-semibold text-xl">
                        <IconClockPause size={32} />
                        <Text>What you might have missed</Text>
                    </div>

                    <Scroll className="h-[18vh] w-[80vw]">
                        <Card className="w-full bg-surface" small>
                            Projects changes...
                        </Card>
                    </Scroll>
                </div>
            </Card>
        </Page>
    );
}
