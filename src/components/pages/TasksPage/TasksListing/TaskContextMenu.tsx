import { type Signal, useSignal } from "@preact/signals";
import { IconEdit, IconStatusChange, IconTrashX } from "@tabler/icons-preact";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import Button from "#ui/Button";
import Card from "#ui/Card";
import Context from "#ui/Context";
import Dialog from "#ui/Dialog";
import Text from "#ui/Text";
import { updateTask } from "#utils/fetch";
import { taskStatuses } from "#utils/status";
import type { ProjectData, Task } from "#utils/types";

interface TaskContextMenuProps extends BaseHTMLAttributes<HTMLBaseElement> {
    trigger: string | ComponentChildren;
    projectsSelected: Signal<ProjectData[]>;
    task: Task;
    deleteTask: (_id: string) => void;
    taskDialogOpen: Signal<boolean>;
    editedTask: Signal<Task>;
}

export default function TaskContextMenu(props: TaskContextMenuProps) {
    const open = useSignal<boolean>(false);
    const dialogOpen = useSignal<boolean>(false);

    function editTask() {
        props.editedTask.value = props.task;
        props.taskDialogOpen.value = true;
    }

    async function changeStatus(newId: number) {
        const task: Task = props.task;
        task.status = newId;

        await updateTask(task);
    }

    return (
        <Context trigger={props.trigger} open={open}>
            <Card orientation="col" small>
                <Dialog
                    open={dialogOpen}
                    dialogTitle="Change Status"
                    dialogTrigger={
                        <Button
                            className="h-10 w-full justify-start gap-xs bg-unset text-left text-foreground hover:bg-muted"
                            onClick={() => {
                                open.value = false;
                                dialogOpen.value = true;
                            }}
                        >
                            <IconStatusChange />
                            <Text>Change Status</Text>
                        </Button>
                    }
                >
                    <div className="flex flex-col gap-xs">
                        {taskStatuses.map((s) => (
                            <Button
                                className="w-full cursor-pointer rounded-lg border border-border bg-surface p-xs font-semibold hover:bg-muted"
                                style={{ color: s.color }}
                                onClick={() => changeStatus(s.id)}
                            >
                                {s.title}
                            </Button>
                        ))}
                    </div>
                </Dialog>

                <Button
                    className="h-10 w-full justify-start gap-xs bg-unset text-left text-foreground hover:bg-muted"
                    onClick={() => editTask()}
                >
                    <IconEdit />
                    <Text>Edit Task</Text>
                </Button>

                <Button
                    className="h-10 w-full justify-start gap-xs bg-unset text-left text-foreground hover:bg-muted"
                    onClick={() => props.deleteTask(props.task._id)}
                >
                    <IconTrashX />
                    <Text>Remove Task</Text>
                </Button>
            </Card>
        </Context>
    );
}
