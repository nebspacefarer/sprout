import { Toast } from "@base-ui/react";
import { IconAdjustmentsCog, IconEdit, IconTrashX } from "@tabler/icons-preact";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Text from "#ui/Text";
import { deleteProject } from "#utils/fetch";
import { useStore } from "#utils/store";

export default function ProjectMenu() {
    const store = useStore();
    const toastManager = Toast.useToastManager();

    async function runDeleteProject() {
        const data = await deleteProject(store.project);

        if (data.err) {
            toastManager.add({
                title: "An error occured.",
                description: data.err,
                type: "error",
            });
        }

        store.projects = [
            ...store.projects.filter(
                (p) => p.project._id !== store.project._id,
            ),
        ];

        toastManager.add({
            description: "Project successfully deleted.",
            type: "success",
        });
    }

    return (
        <MenuSelect menuPlaceholder={<IconAdjustmentsCog />}>
            <MenuSelectItem
                onClick={null}
                className="flex items-center gap-xs text-md"
            >
                <IconEdit />
                <Text>Edit Project</Text>
            </MenuSelectItem>

            <MenuSelectItem
                onClick={() => runDeleteProject()}
                className="flex items-center gap-xs text-md hover:text-danger"
            >
                <IconTrashX />
                <Text>Delete Project</Text>
            </MenuSelectItem>
        </MenuSelect>
    );
}
