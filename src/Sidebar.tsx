import { Toast } from "@base-ui/react";
import { Separator } from "@base-ui/react/separator";
import { type Signal, useSignal } from "@preact/signals";
import {
	IconDashboard,
	IconInbox,
	IconLayoutGridAdd,
	IconListDetails,
	IconLogout,
	IconMailPlus,
	IconMenu2,
	IconNote,
	IconPlant,
	IconSettings,
} from "@tabler/icons-preact";
import type { ComponentChildren } from "preact";
import { useLocation } from "wouter";
import Popover from "#ui/Popover";
import Show from "#ui/Show";
import { cn } from "#utils/cn";
import { postLogout } from "#utils/fetch";
import type { PublicUser } from "#utils/types";
import AddProjectDialog from "./components/dialogs/AddProject";
import LoginDialog from "./components/dialogs/LoginDialog";
import RegisterDialog from "./components/dialogs/RegisterDialog";
import Avatar from "./components/ui/Avatar";
import Button from "./components/ui/Button";
import Link from "./components/ui/Link";
import Text from "./components/ui/Text";

export default function Sidebar() {
	const [location, _navigate] = useLocation();

	const projectDialogOpen = useSignal<boolean>(false);
	const user = useSignal<PublicUser | null>(
		JSON.parse(localStorage.getItem("user")),
	);

	const links: {
		name?: string;
		href?: string;
		icon?: ComponentChildren;
		children?: ComponentChildren;
		separator?: ComponentChildren;
	}[] = [
			{ name: "Dashboard", href: "/dashboard", icon: <IconDashboard /> },
			{
				name: "Inbox",
				href: "/inbox",
				icon: <IconInbox />,
				children: (
					<Button className="opacity-0 transition-all group-hover:opacity-100">
						<IconMailPlus size={22} />
					</Button>
				),
			},
			{ separator: <Separator orientation="vertical" /> },
			{
				name: "Projects",
				href: "/projects",
				icon: <IconPlant />,
				children: (
					<AddProjectDialog
						open={projectDialogOpen}
						dialogTrigger={
							<Button
								className="opacity-0 transition-all group-hover:opacity-100"
								onClick={() => (projectDialogOpen.value = true)}
							>
								<IconLayoutGridAdd size={22} />
							</Button>
						}
					/>
				),
			},
			{ name: "Tasks", href: "/tasks", icon: <IconListDetails /> },
			{ name: "Notes", href: "/notes", icon: <IconNote /> },
		];

	return (
		<div className={cn("flex flex-col bg-crust p-sm")}>
			<div className="flex-1">
				<div className="flex flex-col gap-xs">
					{links.map((link) =>
						link.separator === undefined ? (
							<div className="group flex items-center justify-between">
								<Link
									href={link.href}
									className={cn(
										"flex items-center gap-xs",
										location.includes(link.href) &&
										"text-primary",
									)}
								>
									{link.icon}
									<Text className="font-bold">
										{link.name}
									</Text>
								</Link>

								{link.children}
							</div>
						) : (
							<Separator orientation="vertical" />
						),
					)}
				</div>
			</div>

			<Show when={!user.value}>
				<Disconnected user={user} />
			</Show>
			<Show when={user.value !== null}>
				<Connected user={user} />
			</Show>
		</div>
	);
}

function Disconnected({ user }: { user: Signal<PublicUser> }) {
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

			<LoginDialog
				open={loginDialogOpen}
				callback={(updatedUser) => (user.value = updatedUser)}
			/>
			<RegisterDialog open={registerDialogOpen} />
		</div>
	);
}

function Connected({ user }: { user: Signal<PublicUser> }) {
	const toastManager = Toast.useToastManager();

	async function logout() {
		const data = await postLogout();

		if (data.err) {
			toastManager.add({
				title: "An error occured",
				description: "Could not log out properly.",
				type: "error",
			});

			return console.error(data.err);
		}

		toastManager.add({
			description: "Logged out successfully. Be back soon!",
		});

		user.value = null;
	}

	return (
		<Popover
			popoverTitle={user.value.username}
			trigger={
				<div className="flex items-center gap-xs">
					<Avatar src={user.value.avatar} fallback="NE" />

					<Text size="sm" className="font-semibold">
						{user.value.username}
					</Text>

					<IconMenu2 size={18} />
				</div>
			}
		>
			<Button className="h-8 w-full gap-xs border border-border bg-crust text-foreground hover:bg-border">
				<IconSettings />
				<Text>Settings</Text>
			</Button>
			<Button
				className="h-8 w-full gap-xs border border-border bg-crust text-foreground hover:bg-border"
				onClick={() => logout()}
			>
				<IconLogout />
				<Text>Log Out</Text>
			</Button>
		</Popover>
	);
}
