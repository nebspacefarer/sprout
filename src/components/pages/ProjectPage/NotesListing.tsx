import { IconNote } from "@tabler/icons-preact";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { useStore } from "#utils/store";
import type { Note } from "#utils/types";

export default function NotesListing() {
    const store = useStore();

    return (
        <div className="flex w-full flex-col gap-xs">
            {store.notes.map((note: Note) => (
                <Card className="flex items-center gap-sm bg-surface" small>
                    <IconNote />
                    <Text className="font-semibold">{note.title}</Text>
                </Card>
            ))}

            <Show when={store.notes.length === 0}>
                <Text className="text-muted">
                    No note found for {store.project.title}.
                </Text>
            </Show>
        </div>
    );
}
