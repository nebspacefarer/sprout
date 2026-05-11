import { Separator } from "@base-ui/react/separator";
import { IconMenu2 } from "@tabler/icons-preact";
import { cn } from "#utils/cn";
import Avatar from "./components/ui/Avatar";
import Text from "./components/ui/Text";

export default function Sidebar() {
	return (
		<div className={cn("flex flex-col p-sm")}>
			<div className="flex-1">
				<div className="flex flex-col gap-xs">
					<Text className="font-bold">Dashboard</Text>
					<Separator orientation="vertical" />

					<Text className="font-bold">Projects</Text>
					<Text className="font-bold">Tasks</Text>
					<Text className="font-bold">Notes</Text>
					<Separator orientation="vertical" />
				</div>
			</div>
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
		</div>
	);
}
