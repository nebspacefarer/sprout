import type { Signal } from "@preact/signals";
import { IconEdit, IconStatusChange, IconTrashX } from "@tabler/icons-preact";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import Button from "#ui/Button";
import Card from "#ui/Card";
import ContextMenu from "#ui/ContextMenu";
import Text from "#ui/Text";
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
    function editTask() {
        props.editedTask.value = props.task;
        props.taskDialogOpen.value = true;
    }

    return (
        <ContextMenu trigger={props.trigger}>
            <Card orientation="col" small>
                <Button className="h-10 w-full justify-start gap-xs bg-unset text-left text-foreground hover:bg-muted">
                    <IconStatusChange />
                    <Text>Change Status</Text>
                </Button>

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
        </ContextMenu>
    );
}
