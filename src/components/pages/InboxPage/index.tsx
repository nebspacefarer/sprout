import { Toast } from "@base-ui/react";
import { useSignal } from "@preact/signals";
import { IconInbox, IconTrashX } from "@tabler/icons-preact";
import { useEffect } from "preact/hooks";
import Page from "src/components/Page";
import Button from "#ui/Button";
import Card from "#ui/Card";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { deleteInbox, getInbox, postInbox } from "#utils/fetch";
import { useStore } from "#utils/store";
import type { Inbox } from "#utils/types";
import EntryQuickAddBar from "./EntryQuickAddBar";

export default function InboxPage() {
    const store = useStore();
    const toastManager = Toast.useToastManager();
    const entry = useSignal<string>("");

    useEffect(() => {
        async function init() {
            const data = await getInbox();
            store.inbox = data.entries;
        }

        init();
    }, []);

    async function runPostInbox() {
        const entryInbox: Inbox = {
            title: entry.value,
            userId: "0",
        };

        const data = await postInbox(entryInbox);

        if (data.err) {
            return toastManager.add({
                title: "An error occured",
                description: data.err,
                type: "error",
            });
        }

        toastManager.add({
            description: "Inbox entry created successfully!",
        });

        store.inbox = [...store.inbox, data.entry];
    }

    async function runDeleteEntry(entry: Inbox) {
        const data = await deleteInbox(entry);

        if (data.err) {
            return toastManager.add({
                title: "An error occured",
                description: data.err,
                type: "error",
            });
        }

        toastManager.add({
            description: "Inbox entry deleted sucessfully.",
        });

        store.inbox = [...store.inbox.filter((e) => e._id === data.entry._id)];
    }

    return (
        <Page auth pageIcon={<IconInbox />} pageTitle="Inbox">
            <EntryQuickAddBar entry={entry} addEntry={() => runPostInbox()} />

            <Card>
                {store.inbox.map((entry) => (
                    <Card
                        className="flex w-full items-center justify-between bg-surface"
                        small
                    >
                        <Text> {entry.title}</Text>
                        <Button onClick={() => runDeleteEntry(entry)}>
                            <IconTrashX />
                        </Button>
                    </Card>
                ))}

                <Show when={store.inbox.length === 0}>
                    <Text className="text-muted">No Inbox entry.</Text>
                </Show>
            </Card>
        </Page>
    );
}
