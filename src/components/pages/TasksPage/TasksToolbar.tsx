import type { DeepSignalType } from "@deepsignal/preact";
import type { Signal } from "@preact/signals";
import {
	IconCheck,
	IconEyeCheck,
	IconLayoutKanban,
	IconLayoutList,
	IconSection,
	IconSortDescending2,
} from "@tabler/icons-preact";
import Button from "#ui/Button";
import Field from "#ui/Field";
import { MenuCheckbox, MenuCheckboxItem } from "#ui/MenuCheckbox";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Text from "#ui/Text";
import Toggle from "#ui/Toggle";
import ToggleGroup from "#ui/ToggleGroup";
import Toolbar from "#ui/Toolbar";
import { cn } from "#utils/cn";
import { useStore } from "#utils/store";
import type { ProjectData } from "#utils/types";

export default function TasksToolbar({
	projectsSelected,
	search,
	checkedFields,
	sort,
	layout,
}: {
	projectsSelected: Signal<ProjectData[]>;
	search: Signal<string>;
	checkedFields: DeepSignalType<{
		assignees: true;
		dueAt: true;
		priority: true;
		tags: true;
		timetrack: true;
	}>;
	sort: Signal<string>;
	layout: Signal<string[]>;
}) {
	const store = useStore();

	function isProjectSelected(project: ProjectData) {
		return (
			projectsSelected.value.find(
				(p) => p.project._id === project.project._id,
			) !== undefined
		);
	}

	function selectProject(project: ProjectData) {
		if (!isProjectSelected(project)) {
			projectsSelected.value = [...projectsSelected.value, project];
		} else {
			projectsSelected.value = [
				...projectsSelected.value.filter(
					(p) => p.project._id !== project.project._id,
				),
			];
		}
	}

	return (
		<Toolbar>
			<MenuCheckbox menuTitle="Projects selected">
				{store.projects.map((project: ProjectData) => (
					<Button
						className={cn(
							"flex min-w-[200px] items-center justify-start gap-xs bg-unset text-left font-normal text-foreground hover:text-foreground",
							isProjectSelected(project)
								? "text-foreground"
								: "text-muted",
						)}
						onClick={() => selectProject(project)}
					>
						<IconCheck
							size={14}
							className={cn(
								"transition-all",
								isProjectSelected(project)
									? "opacity-100"
									: "opacity-0",
							)}
						/>
						<Text>{project.project.title}</Text>
					</Button>
				))}
			</MenuCheckbox>

			<Field
				fieldTitle="Search"
				placeholder="Find task..."
				value={search}
				horizontal
			/>

			<ToggleGroup defaultValue={["section"]} value={layout}>
				<Toggle value="section" title="Layout: Section">
					<IconSection />
				</Toggle>
				<Toggle value="list" title="Layout: List">
					<IconLayoutList />
				</Toggle>
				<Toggle value="kanban" title="Layout: Kanban">
					<IconLayoutKanban />
				</Toggle>
			</ToggleGroup>

			<MenuCheckbox menuTitle={<IconEyeCheck />}>
				<MenuCheckboxItem checked={checkedFields.assignees}>
					<Text>Assignee(s)</Text>
				</MenuCheckboxItem>
				<MenuCheckboxItem checked={checkedFields.dueAt}>
					<Text>Due Date</Text>
				</MenuCheckboxItem>
				<MenuCheckboxItem checked={checkedFields.priority}>
					<Text>Priority</Text>
				</MenuCheckboxItem>
				<MenuCheckboxItem checked={checkedFields.tags}>
					<Text>Tag(s)</Text>
				</MenuCheckboxItem>
				<MenuCheckboxItem checked={checkedFields.timetrack}>
					<Text>Time Tracking</Text>
				</MenuCheckboxItem>
			</MenuCheckbox>

			<MenuSelect menuPlaceholder={<IconSortDescending2 />}>
				<MenuSelectItem
					onClick={() => (sort.value = "createdAt")}
					className={cn(
						sort.value === "createdAt" && "text-foreground",
					)}
				>
					Created Date
				</MenuSelectItem>
				<MenuSelectItem onClick={() => (sort.value = "dueAt")}>
					Due Date
				</MenuSelectItem>
				<MenuSelectItem onClick={() => (sort.value = "dueAt")}>
					Title
				</MenuSelectItem>
			</MenuSelect>
		</Toolbar>
	);
}
