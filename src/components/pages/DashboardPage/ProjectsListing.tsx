import Avatar from "#ui/Avatar";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { projectStatuses } from "#utils/status";
import { useStore } from "#utils/store";
import { toFallback } from "#utils/strings";
import type { ProjectData } from "#utils/types";

export default function ProjectsListing() {
    const store = useStore();

    return (
        <div className="flex w-full flex-col gap-xs">
            {store.projects.map((projectData: ProjectData) => {
                const project = projectData.project;

                return (
                    <Card
                        className="flex items-center justify-between bg-surface"
                        small
                    >
                        <div className="flex items-center gap-sm">
                            <Text
                                className="text-sm uppercase"
                                style={{
                                    color: projectStatuses[project.status]
                                        .color,
                                }}
                            >
                                {projectStatuses[project.status].title}
                            </Text>
                            <Show when={project.icon.length > 0}>
                                <Avatar src={project.icon} fallback="" />
                            </Show>

                            <Text className="font-semibold">
                                {project.title}
                            </Text>
                        </div>

                        <div className="flex items-center gap-sm">
                            {project.permissions?.map((p) => (
                                <Avatar
                                    src={p.user.avatar}
                                    fallback={toFallback(p.user.username)}
                                />
                            ))}
                        </div>
                    </Card>
                );
            })}

            <Show when={store.projects.length === 0}>
                <Text className="text-muted">No project found.</Text>
            </Show>
        </div>
    );
}
