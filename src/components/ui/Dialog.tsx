import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { Signal } from "@preact/signals";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import { cn } from "#utils/cn";

interface DialogProps extends BaseHTMLAttributes<HTMLBaseElement> {
	open: Signal<boolean>;
	dialogTrigger: ComponentChildren;
	dialogTitle: string;
	dialogAccept?: ComponentChildren;
}

export default function Dialog(props: DialogProps) {
	return (
		<BaseDialog.Root open={props.open.value}>
			<BaseDialog.Trigger>{props.dialogTrigger}</BaseDialog.Trigger>
			<BaseDialog.Portal>
				<BaseDialog.Backdrop className="fixed inset-0 min-h-dvh bg-black opacity-20 transition-all duration-150 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0 supports-[-webkit-touch-callout:none]:absolute dark:opacity-70" />
				<BaseDialog.Popup
					className={cn(
						"fixed top-1/2 left-1/2 -mt-sm w-96 max-w-[calc(100vw-3rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-crust p-sm transition-all duration-150 data-[ending-style]:scale-90 data-[starting-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
						props.className,
					)}
				>
					<BaseDialog.Title className="-mt-1.5 mb-1 font-bold text-lg">
						{props.dialogTitle}
					</BaseDialog.Title>
					<BaseDialog.Description className="mb-sm py-sm">
						{props.children}
					</BaseDialog.Description>
					<div className="flex justify-end gap-xs">
						{props.dialogAccept}
						<BaseDialog.Close className="flex h-10 cursor-pointer select-none items-center justify-center rounded-md px-3.5 hover:bg-surface focus-visible:outline-2 focus-visible:outline-blue-800 focus-visible:-outline-offset-1 active:bg-gray-100">
							Close
						</BaseDialog.Close>
					</div>
				</BaseDialog.Popup>
			</BaseDialog.Portal>
		</BaseDialog.Root>
	);
}
