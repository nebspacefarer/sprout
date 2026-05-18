import { useDeepSignal } from "@deepsignal/preact";
import { IconDots } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import { useLocation } from "wouter";
import { textToParam } from "#utils/strings";
import type { Project } from "#utils/types";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Tag from "../ui/Tag";
import Text from "../ui/Text";

export default function ProjectsPage() {
    const [_location, navigate] = useLocation();

    const store = useDeepSignal({
        projects: [],
    });

    useEffect(() => {
        async function getProfiles() {
            const result = await fetch(`http://localhost:3536/api/projects`);
            const data = await result.json();

            console.log(data);

            store.projects.value = data.projects;
        }

        getProfiles();
    }, []);

    return (
        <div>
            {store.projects.value.map((project: Project) => (
                <Button
                    className="bg-unset text-left text-foreground"
                    onClick={() =>
                        navigate(`/projects/${textToParam(project.title)}`)
                    }
                >
                    <ProjectCard project={project} />
                </Button>
            ))}
        </div>
    );
}

function ProjectCard({ project }: { project: Project }) {
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

                <Text className="text-muted italic">{project.desc}</Text>
                <div className="flex items-center gap-xs">
                    <Tag className="bg-[#f6f655] text-black">
                        {project.status}
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
