import { IconLayoutSidebarLeftCollapse } from "@tabler/icons-preact";
import Text from "./components/ui/Text";

export default function Topbar() {
	return (
		<div className="flex items-center gap-xs p-xs">
			<IconLayoutSidebarLeftCollapse size={32} />
			<Text size="h1">Title...</Text>
		</div>
	);
}
