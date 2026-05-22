import { useSignal } from "@preact/signals";
import { IconDots, IconPlant } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import { useLocation } from "wouter";
import Show from "#ui/Show";
import { getProjects } from "#utils/fetch";
import { projectStatuses } from "#utils/status";
import { textToParam } from "#utils/strings";
import type { Project, ProjectData, Status } from "#utils/types";
import Page from "../Page";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Tag from "../ui/Tag";
import Text from "../ui/Text";

export default function ProjectsPage() {
    const [_location, navigate] = useLocation();

    const projects = useSignal<ProjectData[]>([]);

    useEffect(() => {
        async function init() {
            const data = await getProjects();

            if (data === undefined || data.err) {
                return console.error(data?.err);
            }

            projects.value = [...data.projects];
        }

        init();
    }, []);

    return (
        <Page auth pageIcon={<IconPlant />} pageTitle="Projects">
            <div className="flex flex-wrap gap-sm">
                {projects.value.map((project: ProjectData) => (
                    <Button
                        className="bg-unset text-left text-foreground"
                        onClick={() =>
                            navigate(
                                `/projects/${textToParam(project.project.title)}`,
                            )
                        }
                    >
                        <ProjectCard project={project.project} />
                    </Button>
                ))}

                <Show when={projects.value.length === 0}>
                    <Text className="text-muted">No project... yet?</Text>
                </Show>
            </div>
        </Page>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const status: Status = projectStatuses.find((p) => p.id === project.status);

    return (
        <Card>
            <Avatar
                src={project.icon}
                fallback={project.title.substring(0, 2).toUpperCase()}
                className="size-18 bg-surface"
            />
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-xs">
                    <Text className="font-semibold text-lg">
                        {project.title}
                    </Text>
                    <Button>
                        <IconDots size={18} />
                    </Button>
                </div>

                <Text className="text-muted italic" title={project.desc}>
                    {project.desc.substring(0, 35)}
                    {project.desc.length > 35 && "[...]"}
                </Text>
                <div className="flex items-center gap-xs">
                    <Tag
                        className="text-black"
                        style={{ backgroundColor: status.color }}
                    >
                        {status.title}
                    </Tag>

                    <Text>-</Text>

                    {project.tags.map((tag) => (
                        <Tag className="bg-muted">{tag.name}</Tag>
                    ))}
                </div>
                <Text className="text-sm">
                    Last update: {project.updatedAt}
                </Text>
            </div>
        </Card>
    );
}
