import { navigate } from "wouter/use-browser-location";
import type { Project, Task } from "./types";

const url = "http://localhost:3536/api";

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

            const _refreshData = await refreshResult.json();
            // TODO: Cannot refresh tokens case

            // Resend origin request
            result = await fetch(path, options);
            data = await result.json();
        }

        if (data.err.code === "FST_JWT_NO_AUTHORIZATION_IN_COOKIE") {
            data = { err: "Not logged in." };
            navigate("/", { replace: true });
        }
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

// PROJECTS

export async function getProjects() {
    return await callApi(`${url}/projects`, {
        credentials: "include",
    });
}

export async function getProjectByName(name: string) {
    return await callApi(`${url}/projects/${name}`);
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
    return await fetch(`${url}/tasks`, {
        method: "DELETE",
        credentials: "include",
        body: JSON.stringify({ _id: task._id }),
    });
}
