import type { BaseHTMLAttributes } from "preact";
import { Link as WouterLink } from "wouter";
import { cn } from "#utils/cn";

interface LinkProps extends BaseHTMLAttributes<HTMLBaseElement> { }

export default function Link(props: LinkProps) {
    return (
        <WouterLink
            href={props.href as string}
            className={cn(
                "cursor-pointer transition-all hover:text-primary",
                props.className,
            )}
        >
            {props.children}
        </WouterLink>
    );
}
