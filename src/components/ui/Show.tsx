import type { BaseHTMLAttributes, ComponentChildren } from "preact";

interface ShowProps extends BaseHTMLAttributes<HTMLBaseElement> {
	when: boolean;
	fallback?: ComponentChildren;
}

export default function Show(props: ShowProps) {
	return props.when
		? props.children
		: props.fallback !== undefined
			? props.fallback
			: null;
}
