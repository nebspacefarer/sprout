import { Separator } from "@base-ui/react/separator";
import { useSignal } from "@preact/signals";
import {
	IconLayoutGridAdd,
	IconMailPlus,
	IconMenu2,
} from "@tabler/icons-preact";
import Show from "#ui/Show";
import { cn } from "#utils/cn";
import AddProjectDialog from "./components/dialogs/AddProject";
import LoginDialog from "./components/dialogs/LoginDialog";
import RegisterDialog from "./components/dialogs/RegisterDialog";
import Avatar from "./components/ui/Avatar";
import Button from "./components/ui/Button";
import Link from "./components/ui/Link";
import Text from "./components/ui/Text";

export default function Sidebar() {
	const projectDialogOpen = useSignal<boolean>(false);

	return (
		<div className={cn("flex flex-col bg-crust p-sm")}>
			<div className="flex-1">
				<div className="flex flex-col gap-xs">
					<Link href="/dashboard">
						<Text className="font-bold">Dashboard</Text>
					</Link>

					<div className="group flex items-center justify-between">
						<Link href="/inbox" className="flex-1">
							<Text className="font-bold">Inbox</Text>
						</Link>
						<Button className="opacity-0 transition-all group-hover:opacity-100">
							<IconMailPlus size={22} />
						</Button>
					</div>
					<Separator orientation="vertical" />

					<div className="group flex items-center justify-between">
						<Link href="/projects" className="flex-1">
							<Text className="font-bold">Projects</Text>
						</Link>

						<AddProjectDialog
							open={projectDialogOpen}
							dialogTrigger={
								<Button
									className="opacity-0 transition-all group-hover:opacity-100"
									onClick={() =>
										(projectDialogOpen.value = true)
									}
								>
									<IconLayoutGridAdd size={22} />
								</Button>
							}
						/>
					</div>

					<Link href="/tasks">
						<Text className="font-bold">Tasks</Text>
					</Link>

					<Link href="/notes">
						<Text className="font-bold">Notes</Text>
					</Link>
					<Separator orientation="vertical" />
				</div>
			</div>

			<Show when={true}>
				<Disconnected />
			</Show>
			<Show when={false}>
				<Connected />
			</Show>
		</div>
	);
}

function Disconnected() {
	const loginDialogOpen = useSignal<boolean>(false);
	const registerDialogOpen = useSignal<boolean>(false);

	return (
		<div className="flex items-center gap-xs">
			<Button onClick={() => (loginDialogOpen.value = true)}>
				Login
			</Button>
			<Button onClick={() => (registerDialogOpen.value = true)}>
				Register
			</Button>

			<LoginDialog open={loginDialogOpen} />
			<RegisterDialog open={registerDialogOpen} />
		</div>
	);
}

function Connected() {
	return (
		<div className="flex items-center gap-xs">
			<Avatar
				src="https://cdn.modrinth.com/data/TXl4HOmY/5dbaf5df7277868b0df9535416b038f96dcc6b0e_96.webp"
				fallback="NE"
			/>

			<Text size="sm" className="font-semibold">
				NebSpacefarer
			</Text>

			<IconMenu2 size={18} />
		</div>
	);
}
