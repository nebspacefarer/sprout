import { Toast } from "@base-ui/react";
import { type Signal, useSignal } from "@preact/signals";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import { useLocation } from "wouter";
import Button from "#ui/Button";
import Dialog from "#ui/Dialog";
import Field from "#ui/Field";
import Show from "#ui/Show";
import Text from "#ui/Text";
import { postLogin } from "#utils/fetch";

interface DialogProps extends BaseHTMLAttributes<HTMLBaseElement> {
    open: Signal<boolean>;
    dialogTrigger?: ComponentChildren;
}

export default function LoginDialog(props: DialogProps) {
    const [_location, navigate] = useLocation();
    const toastManager = Toast.useToastManager();
    const error = useSignal<string>("");

    const email = useSignal<string>("");
    const password = useSignal<string>("");

    async function login() {
        if (email.value === "") {
            error.value = "Email is required.";
            return;
        }

        if (password.value === "") {
            error.value = "Password is required.";
            return;
        }

        const data = await postLogin(email.value, password.value);

        if (data.error) {
            error.value = data.error;
            return;
        }

        toastManager.add({
            title: "Logged in",
            description: "You have successfully logged in.",
            type: "success",
        });

        props.open.value = false;
        navigate("/dashboard");
    }

    return (
        <Dialog
            open={props.open}
            dialogTitle="Login"
            dialogAccept={<Button onClick={() => login()}>Login</Button>}
        >
            <div className="flex flex-col gap-sm">
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
