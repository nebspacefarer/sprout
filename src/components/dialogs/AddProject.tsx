import { type Signal, useSignal } from "@preact/signals";
import { IconPhotoPlus } from "@tabler/icons-preact";
import type { BaseHTMLAttributes, ComponentChildren } from "preact";
import { useLocation } from "wouter";
import { cn } from "#utils/cn";
import { postProject } from "#utils/fetch";
import { projectStatuses } from "#utils/status";
import { useStore } from "#utils/store";
import type { Project, Tag } from "#utils/types";
import Avatar from "../ui/Avatar";
import Button from "../ui/Button";
import { Combobox, type LabelItem } from "../ui/Combobox";
import Dialog from "../ui/Dialog";
import Field from "../ui/Field";
import Select from "../ui/Select";
import Show from "../ui/Show";
import Text from "../ui/Text";

interface DialogProps extends BaseHTMLAttributes<HTMLBaseElement> {
	open: Signal<boolean>;
	dialogTrigger: ComponentChildren;
}

export default function AddProjectDialog(props: DialogProps) {
	const [_location, _navigate] = useLocation();
	const store = useStore();

	const error = useSignal<string>("");

	const icon = useSignal<string>("");
	const title = useSignal<string>("");
	const desc = useSignal<string>("");
	const status = useSignal<string>("");
	const tagsItems = useSignal<LabelItem[]>();

	function onFilePicked(files: FileList) {
		if (files.length) {
			const file = files[0];

			// TODO: Upload File through API

			// Display File as Icon
			icon.value = URL.createObjectURL(file);
		}
	}

	function validateProject() {
		error.value = "";

		if (title.value.length < 3) {
			error.value += "Please enter a name with more than 3 characters. ";
		}

		if (!status.value.length) {
			error.value +=
				"Please select an appropriate status for your project. ";
		}

		if (error.value !== "") {
			return false;
		}

		return true;
	}

	async function createProject() {
		if (!validateProject()) return;

		const tags: Tag[] = [];

		if (tagsItems.value !== undefined) {
			for (const tagItem of tagsItems.value) {
				const tag: Tag = {
					name: tagItem.value,
					color: "#000000",
				};
				tags.push(tag);
			}
		}

		const project: Project = {
			title: title.value,
			icon: icon.value,
			desc: desc.value,
			status: projectStatuses.find((p) => p.title === status.value).id,
			tags: tags,
		};

		const data = await postProject(project);

		if (data) {
			store.projects = [...store.projects, data.project];
			props.open.value = false;
		}
	}

	return (
		<Dialog
			open={props.open}
			dialogTrigger={props.dialogTrigger}
			dialogTitle="Create Project"
			dialogAccept={<Button onClick={() => createProject()}>Add</Button>}
			className="w-1/3"
		>
			<div className="flex flex-col gap-sm">
				<Text className="font-bold">Icon</Text>
				<div
					className={cn(
						"relative mx-auto p-xs",
						icon.value.length && "rounded-full bg-surface",
					)}
				>
					<Avatar
						src={icon.value}
						fallback=""
						size="128"
						className="h-full w-full"
					/>
					<label
						for="file-picker"
						className="absolute right-0 bottom-0 flex size-12 cursor-pointer items-center justify-center rounded-full bg-surface"
					>
						<IconPhotoPlus className="text-primary" />
					</label>
					<input
						id="file-picker"
						type="file"
						className="hidden"
						multiple={false}
						accept="image/webp, image/png, image/gif, image/jpeg"
						onChange={(ev) => onFilePicked(ev.currentTarget.files)}
					/>
				</div>
				<Field
					fieldTitle="Name*"
					placeholder="Enter name..."
					value={title}
				/>
				<Field
					fieldTitle="Description"
					placeholder="Enter description..."
					value={desc}
				/>
				<Select
					selectTitle="Status*"
					placeholder="Current status..."
					items={projectStatuses.map((p) => p.title)}
					value={status}
				/>
				<Combobox
					id="tags"
					comboTitle="Tags"
					placeholder="Tags..."
					value={tagsItems}
					items={[{ value: "Tag", id: "tag" }]}
				/>

				<Show when={error.value !== ""}>
					<Text className="text-center text-danger">
						{error.value}
					</Text>
				</Show>
			</div>
		</Dialog>
	);
}
