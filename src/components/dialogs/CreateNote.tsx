import { Toast } from "@base-ui/react";
import { type Signal, useSignal } from "@preact/signals";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import Button from "#ui/Button";
import Dialog from "#ui/Dialog";
import Field from "#ui/Field";
import MarkdownEditor from "#ui/MarkdownEditor";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Text from "#ui/Text";
import { postNote } from "#utils/fetch";
import { useStore } from "#utils/store";
import type { Note, Project } from "#utils/types";

interface DialogProps extends BaseHTMLAttributes<HTMLBaseElement> {
    open: Signal<boolean>;
    dialogTrigger: ComponentChildren;
}

export default function CreateNoteDialog(props: DialogProps) {
    const store = useStore();
    const toastManager = Toast.useToastManager();

    const projectField = useSignal<Project | null>(null);
    const titleField = useSignal<string>("");
    const contentField = useSignal<string>("");

    const error = useSignal<string>("");

    function validateNote(note: Note): boolean {
        if (!note.projectId) {
            error.value = "Please select a parent project.";
            return false;
        }

        if (note.title.length === 0) {
            error.value = "Please enter a title for the note.";
            return false;
        }

        if (note.content.length === 0) {
            error.value = "Please enter content for the note.";
            return false;
        }
    }

    async function createNote() {
        const note: Note = {
            projectId: projectField.value?._id,
            title: titleField.value,
            content: contentField.value,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        if (validateNote(note) === false) {
            console.log("Could not validate note");
            return;
        }

        const data = await postNote(note);

        if (data.err) {
            toastManager.add({
                title: "An error occured",
                description: data.err,
                type: "error",
            });
        }

        console.log(data);

        if (store.notes) {
            store.notes = [...store.notes, data.note];
        } else {
            store.notes = [data.note];
        }

        toastManager.add({
            description: "Note successfully created!",
            type: "success",
        });

        props.open.value = false;
    }

    return (
        <Dialog
            open={props.open}
            dialogTrigger={props.dialogTrigger}
            dialogTitle="Create Note"
            dialogAccept={<Button onClick={() => createNote()}>Add</Button>}
            className="w-2/3"
        >
            <div className="flex flex-col gap-sm">
                <MenuSelect
                    menuTitle={"Parent Project"}
                    menuPlaceholder={
                        projectField.value?.title ?? (
                            <Text className="text-muted">
                                Select a project...
                            </Text>
                        )
                    }
                >
                    {store.projects.map((p) => (
                        <MenuSelectItem
                            onClick={() => (projectField.value = p.project)}
                        >
                            {p.project.title}
                        </MenuSelectItem>
                    ))}
                </MenuSelect>

                <Field
                    fieldTitle="Title"
                    placeholder="Enter note title..."
                    value={titleField}
                />

                <MarkdownEditor
                    value={contentField}
                    placeholder="Write your note content..."
                />

                <Text className="text-center text-danger text-sm">
                    {error.value}
                </Text>
            </div>
        </Dialog>
    );
}
