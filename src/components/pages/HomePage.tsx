import { IconHome } from "@tabler/icons-preact";
import Text from "#ui/Text";
import Page from "../Page";

export default function HomePage() {
	return (
		<Page pageIcon={<IconHome />} pageTitle="Home">
			<Text>Home Content...</Text>
		</Page>
	);
}
