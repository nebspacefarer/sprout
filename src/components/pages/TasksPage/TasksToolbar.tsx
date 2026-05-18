import type { DeepSignalType } from "@deepsignal/preact";
import type { Signal } from "@preact/signals";
import {
    IconEyeCheck,
    IconLayoutKanban,
    IconLayoutList,
    IconSection,
    IconSortDescending2,
} from "@tabler/icons-preact";
import Field from "#ui/Field";
import { MenuCheckbox, MenuCheckboxItem } from "#ui/MenuCheckbox";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Text from "#ui/Text";
import Toggle from "#ui/Toggle";
import ToggleGroup from "#ui/ToggleGroup";
import Toolbar from "#ui/Toolbar";
import { cn } from "#utils/cn";

export default function TasksToolbar({
    search,
    checked,
    sort,
}: {
    search: Signal;
    checked: DeepSignalType<{
        assignees: true;
        dueAt: true;
        priority: true;
        tags: true;
        timetrack: true;
    }>;
    sort: Signal;
}) {
    return (
        <Toolbar>
            <Field
                fieldTitle="Search"
                placeholder="Find task..."
                value={search}
                horizontal
            />

            <ToggleGroup defaultValue={["section"]}>
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
                <MenuCheckboxItem checked={checked.assignees}>
                    <Text>Assignee(s)</Text>
                </MenuCheckboxItem>
                <MenuCheckboxItem checked={checked.dueAt}>
                    <Text>Due Date</Text>
                </MenuCheckboxItem>
                <MenuCheckboxItem checked={checked.priority}>
                    <Text>Priority</Text>
                </MenuCheckboxItem>
                <MenuCheckboxItem checked={checked.tags}>
                    <Text>Tag(s)</Text>
                </MenuCheckboxItem>
                <MenuCheckboxItem checked={checked.timetrack}>
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
