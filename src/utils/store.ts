import { deepSignal } from "deepsignal";
import type { Inbox, Note, Project, ProjectData, Task } from "./types";

interface StoreType {
    projects: ProjectData[];
    tasks: Task[];
    notes: Note[];
    inbox: Inbox[];

    project: Project;
}

const storeModel = deepSignal<StoreType>({
    projects: [],
    tasks: [],
    notes: [],
    inbox: [],

    project: null,
});

export function useStore() {
    return storeModel;
}
