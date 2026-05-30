import { useSignal } from "@preact/signals";
import {
    IconLayoutGrid,
    IconLayoutList,
    IconSortDescending2,
} from "@tabler/icons-preact";
import Field from "#ui/Field";
import { MenuSelect, MenuSelectItem } from "#ui/MenuSelect";
import Toggle from "#ui/Toggle";
import ToggleGroup from "#ui/ToggleGroup";
import Toolbar from "#ui/Toolbar";
import { cn } from "#utils/cn";

export default function NotesToolbar() {
    const searchField = useSignal<string>("");
    const layout = useSignal<string[]>(["grid"]);
    const sort = useSignal<string>("createdAt");

    return (
        <Toolbar>
            <div className="flex items-center gap-xs">
                <Field
                    fieldTitle="Search"
                    placeholder="Search notes..."
                    value={searchField}
                    horizontal
                />

                <ToggleGroup value={layout} defaultValue={layout.value}>
                    <Toggle value={"grid"}>
                        <IconLayoutGrid />
                    </Toggle>
                    <Toggle value={"list"}>
                        <IconLayoutList />{" "}
                    </Toggle>
                </ToggleGroup>

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
            </div>
        </Toolbar>
    );
}
