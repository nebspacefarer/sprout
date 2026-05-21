import { Toast } from "@base-ui/react";
import { type Signal, useSignal } from "@preact/signals";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import { useLocation } from "wouter";
import Button from "#ui/Button";
import Dialog from "#ui/Dialog";
import Field from "#ui/Field";
import Show from "#ui/Show";
import Text from "#ui/Text";

interface DialogProps extends BaseHTMLAttributes<HTMLBaseElement> {
    open: Signal<boolean>;
    dialogTrigger?: ComponentChildren;
}

export default function RegisterDialog(props: DialogProps) {
    const [_location, navigate] = useLocation();
    const toastManager = Toast.useToastManager();
    const error = useSignal<string>("");

    const email = useSignal<string>("");
    const username = useSignal<string>("");
    const password = useSignal<string>("");

    async function register() {
        if (username.value === "") {
            error.value = "Username is required.";
            return;
        }

        if (email.value === "") {
            error.value = "Email is required.";
            return;
        }

        if (password.value === "") {
            error.value = "Password is required.";
            return;
        }

        const result = await fetch(`http://localhost:3536/api/auth/register`, {
            method: "POST",
            body: JSON.stringify({
                email: email.value,
                username: username.value,
                password: password.value,
            }),
        });

        const data = await result.json();

        if (data.error) {
            error.value = data.error;
            return;
        }

        toastManager.add({
            title: "Registration done!",
            description: "You can now login! ",
            type: "success",
        });

        props.open.value = false;
        navigate("/dashboard");
    }

    return (
        <Dialog
            open={props.open}
            dialogTitle="Register"
            dialogAccept={<Button onClick={() => register()}>Register</Button>}
        >
            <div className="flex flex-col gap-sm">
                <Field
                    fieldTitle="Username"
                    placeholder="Enter username..."
                    value={username}
                />
                <Field
                    fieldTitle="Email"
                    placeholder="Enter email..."
                    value={email}
                    type="email"
                />
                <Field
                    fieldTitle="Password"
                    placeholder="Enter password..."
                    value={password}
                    type="password"
                />

                <Show when={error.value !== ""}>
                    <Text className="text-center text-danger text-sm">
                        {error}
                    </Text>
                </Show>
            </div>
        </Dialog>
    );
}
