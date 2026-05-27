import { type Signal, useSignal } from "@preact/signals";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import { useEffect, useRef } from "preact/hooks";
import { cn } from "#utils/cn";
import Button from "./Button";
import Card from "./Card";

interface ContextProps extends BaseHTMLAttributes<HTMLBaseElement> {
    open?: Signal<boolean>;
    trigger: ComponentChildren;
    hover?: boolean;
}

export default function Context(props: ContextProps) {
    const triggerNode = useRef(null);
    const popupNode = useRef(null);
    const open = useSignal<boolean>(props.open?.value ?? false);

    useEffect(() => {
        function openContextMenu(ev: MouseEvent) {
            ev.preventDefault();
            ev.stopPropagation();

            open.value = true;
            popupNode.current.base.style.left = `${ev.offsetX}px`;
        }

        window.addEventListener("click", (ev) => {
            const withinBoundaries = ev
                .composedPath()
                .includes(popupNode.current.base);

            if (open.value && !withinBoundaries) {
                open.value = false;
            }
        });

        if (props.hover) {
            triggerNode.current.base.addEventListener(
                "mouseenter",
                openContextMenu,
            );
        } else {
            triggerNode.current.base.addEventListener(
                "contextmenu",
                openContextMenu,
            );
        }
    }, []);

    return (
        <div className="group relative">
            <Button
                ref={triggerNode}
                className="w-full border-unset bg-unset text-unset"
                style={{ paddingLeft: 0, paddingRight: 0 }}
            >
                {props.trigger}
            </Button>

            <Card
                ref={popupNode}
                orientation="col"
                small
                className={cn(
                    "absolute",
                    open.value ? "block" : "hidden",
                    props.className,
                )}
            >
                {props.children}
            </Card>
        </div>
    );
}
