import { Separator } from "@base-ui/react";
import type { Signal } from "@preact/signals";
import { IconAdjustmentsCog } from "@tabler/icons-preact";
import Avatar from "#ui/Avatar";
import Button from "#ui/Button";
import Text from "#ui/Text";
import type { Project } from "#utils/types";

export default function ProjectToolbar({
    project,
}: {
    project: Signal<Project>;
}) {
    return (
        <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between gap-sm">
                <div className="flex items-center gap-xs">
                    <Avatar
                        src={project.value?.icon}
                        fallback={project.value?.title}
                        className="size-16"
                    />
                    <Text className="border-primary border-b-3 font-semibold text-2xl">
                        {project.value?.title}
                    </Text>
                    <Text>{project.value?.desc}</Text>
                </div>

                <Button className="size-10">
                    <IconAdjustmentsCog size={20} />
                </Button>
            </div>

            <Separator orientation="horizontal" className="h-px bg-border" />
        </div>
    );
}
