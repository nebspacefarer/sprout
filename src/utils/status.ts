import type { Status } from "./types";

export const projectStatuses: Status[] = [
    { id: 0, title: "Brainstorm", color: "#B8B8B8" },
    { id: 1, title: "Ready", color: "#f6f655" },
    { id: 2, title: "In Progress", color: "#5C6DDB" },
    { id: 3, title: "Stale", color: "#FCA465" },
    { id: 4, title: "In Review", color: "#ED82DE" },
    { id: 5, title: "Released", color: "#82ED84" },
    { id: 6, title: "Finished", color: "#549C6A" },
];

export const taskStatuses: Status[] = [
    { id: 0, title: "Todo", color: "#B8B8B8" },
    { id: 1, title: "In Progress", color: "#5C6DDB" },
    { id: 2, title: "Stale", color: "#FCA465" },
    { id: 3, title: "Review Needed", color: "#ED82DE" },
    { id: 4, title: "Reviewed", color: "#82ED84" },
    { id: 5, title: "Done", color: "#549C6A" },
];
