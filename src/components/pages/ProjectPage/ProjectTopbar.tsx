import { Separator } from "@base-ui/react";
import Avatar from "#ui/Avatar";
import Text from "#ui/Text";
import { useStore } from "#utils/store";
import ProjectMenu from "./ProjectMenu";

export default function ProjectToolbar() {
    const store = useStore();

    return (
        <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between gap-sm">
                <div className="flex items-center gap-xs">
                    <Avatar
                        src={store.project.icon}
                        fallback={store.project.title}
                        className="size-16"
                    />
                    <Text className="border-primary border-b-3 font-semibold text-2xl">
                        {store.project.title}
                    </Text>
                    <Text>{store.project.desc}</Text>
                </div>

                <ProjectMenu />
            </div>

            <Separator orientation="horizontal" className="h-px bg-border" />
        </div>
    );
}
