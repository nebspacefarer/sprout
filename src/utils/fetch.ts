import { navigate } from "wouter/use-browser-location";
import type { Inbox, Project, Task } from "./types";

const url = "/api";

async function callApi(path: string, options?: RequestInit) {
    // Send request
    let result = await fetch(path, options);
    let data = await result.json();

    if (data.err) {
        if (data.err.code === "FST_JWT_AUTHORIZATION_TOKEN_EXPIRED") {
            // Access Token Expired, try refresh
            const refreshResult = await fetch(`${url}/auth/refresh`, {
                method: "POST",
                credentials: "include",
            });

            const refreshData = await refreshResult.json();
            if (refreshData.err) {
                localStorage.setItem("user", null);
                navigate("/", { replace: true });
            }
            localStorage.setItem("user", JSON.stringify(refreshData.user));

            // Resend origin request
            result = await fetch(path, options);
            data = await result.json();

            if (data.err) {
                localStorage.setItem("user", null);
                navigate("/", { replace: true });
            }
        }

        if (data.err.code === "FST_JWT_NO_AUTHORIZATION_IN_COOKIE") {
            data = { err: "Not logged in." };
            localStorage.setItem("user", null);
            navigate("/", { replace: true });
        }
    }

    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data;
}

// AUTH

export async function postRegister(
    email: string,
    username: string,
    password: string,
) {
    return await callApi(`${url}/auth/register`, {
        method: "POST",
        body: JSON.stringify({
            email: email,
            username: username,
            password: password,
        }),
    });
}

export async function postLogin(email: string, password: string) {
    return await callApi(`${url}/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    });
}

export async function postLogout() {
    const data = await callApi(`${url}/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    localStorage.setItem("user", null);
    navigate("/", { replace: true });

    return data;
}

// INBOX

export async function getInbox() {
    return await callApi(`${url}/inbox`, {
        credentials: "include",
    });
}

export async function postInbox(entry: Inbox) {
    return await callApi(`${url}/inbox`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(entry),
    });
}

export async function deleteInbox(entry: Inbox) {
    return await callApi(`${url}/inbox`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ _id: entry._id }),
    });
}

// PROJECTS

export async function getProjects() {
    return await callApi(`${url}/projects`, {
        credentials: "include",
    });
}

export async function getProjectByName(name: string) {
    return await callApi(`${url}/projects/${name}`, {
        credentials: "include",
    });
}

export async function postProject(project: Project) {
    return await callApi(`${url}/projects`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(project),
    });
}

// TASKS

export async function postTask(task: Task) {
    return await callApi(`${url}/tasks`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(task),
    });
}

export async function updateTask(dataTask) {
    return await callApi(`${url}/tasks`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(dataTask),
    });
}

export async function deleteTask(task: Task) {
    return await callApi(`${url}/tasks`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ _id: task._id }),
    });
}
