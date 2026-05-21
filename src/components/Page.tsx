import { Separator } from "@base-ui/react";
import type { ComponentChildren } from "preact";
import { Redirect } from "wouter";
import Text from "#ui/Text";
import { isAuthenticated } from "#utils/login";

export default function Page({
    auth = false,
    pageIcon,
    pageTitle,
    children,
}: {
    auth?: boolean;
    pageIcon: ComponentChildren;
    pageTitle: string;
    children: ComponentChildren;
}) {
    if (auth && !isAuthenticated()) return <Redirect to="/" />;

    return (
        <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-xs">
                {pageIcon}
                <Text className="w-fit border-primary border-b-3 font-semibold text-2xl">
                    {pageTitle}
                </Text>
            </div>

            <Separator orientation="horizontal" className="h-px bg-border" />

            {children}
        </div>
    );
}
