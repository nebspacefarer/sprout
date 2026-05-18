import type { Signal } from "@preact/signals";
import { IconNote } from "@tabler/icons-preact";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import type { Note, Project } from "#utils/types";

export default function NotesListing({
    notes,
    project,
}: {
    notes: Signal<Note[]>;
    project: Signal<Project>;
}) {
    return (
        <div className="flex w-full flex-col gap-xs">
            {notes.value.map((note: Note) => (
                <Card className="flex items-center gap-sm bg-surface" small>
                    <IconNote />
                    <Text className="font-semibold">{note.title}</Text>
                </Card>
            ))}

            <Show when={notes.value.length === 0}>
                <Text className="text-muted">
                    No note found for {project.value?.title}.
                </Text>
            </Show>
        </div>
    );
}
