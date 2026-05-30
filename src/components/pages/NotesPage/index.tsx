import { useSignal } from "@preact/signals";
import {
    IconDots,
    IconEdit,
    IconFilePlus,
    IconNote,
    IconTrashX,
} from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import CreateNoteDialog from "src/components/dialogs/CreateNote";
import Page from "src/components/Page";
import Button from "#ui/Button";
import Card from "#ui/Card";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Tag from "#ui/Tag";
import Text from "#ui/Text";
import { getProjects } from "#utils/fetch";
import { useStore } from "#utils/store";
import type { Note, ProjectData } from "#utils/types";
import NotesToolbar from "./NotesToolbar";

export default function NotesPage() {
    const store = useStore();
    const projectsSelected = useSignal<ProjectData[]>([]);

    const createNoteDialogOpen = useSignal<boolean>(false);

    async function runDeleteNote(note: Note) {
        const data = await deleteNote(note);

        if (data.err) {
            return;
        }

        store.notes = [...store.notes.filter((n) => n._id === note._id)];
    }

    useEffect(() => {
        async function init() {
            const data = await getProjects();

            store.projects = data.projects;
            for (const p of data.projects) {
                store.notes = [...store.notes, ...p.notes];
            }

            projectsSelected.value = [...data.projects];
        }

        init();
    }, []);

    return (
        <Page pageIcon={<IconNote />} pageTitle="Notes">
            <NotesToolbar />

            <CreateNoteDialog
                dialogTrigger={
                    <Button
                        className="flex h-10 w-fit items-center"
                        onClick={() => (createNoteDialogOpen.value = true)}
                    >
                        <IconFilePlus />
                        <Text>Create Note</Text>
                    </Button>
                }
                open={createNoteDialogOpen}
            />

            <Card>
                {store.notes?.map(
                    (n) =>
                        projectsSelected.value.find(
                            (p) => p.project._id === n.projectId,
                        ) !== undefined && (
                            <Button
                                className="bg-unset text-unset"
                                onClick={null}
                            >
                                <Card
                                    className="w-[1/4] bg-surface"
                                    orientation="col"
                                    small
                                >
                                    <div className="my-xs flex items-center gap-xs">
                                        <Tag className="bg-border text-muted">
                                            {
                                                projectsSelected.value.find(
                                                    (p) =>
                                                        p.project._id ===
                                                        n.projectId,
                                                ).project.title
                                            }
                                        </Tag>
                                        <Text className="font-semibold text-lg">
                                            {n.title}
                                        </Text>

                                        <MenuSelect
                                            menuPlaceholder={<IconDots />}
                                        >
                                            <MenuSelectItem
                                                onClick={null}
                                                className="flex items-center gap-xs"
                                            >
                                                <IconEdit />
                                                <Text>Edit Note</Text>
                                            </MenuSelectItem>

                                            <MenuSelectItem
                                                onClick={() => runDeleteNote(n)}
                                                className="flex items-center gap-xs"
                                            >
                                                <IconTrashX />
                                                <Text>Delete Note</Text>
                                            </MenuSelectItem>
                                        </MenuSelect>
                                    </div>

                                    <Card small className="w-full">
                                        <Text>
                                            {n.content.length > 100
                                                ? n.content.substring(0, 100)
                                                : n.content}
                                        </Text>
                                    </Card>
                                </Card>
                            </Button>
                        ),
                )}

                {!store.notes && (
                    <Text className="text-muted">No note found.</Text>
                )}
            </Card>
        </Page>
    );
}
