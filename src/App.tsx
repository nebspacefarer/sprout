import "./App.css";
import { Route, Switch } from "wouter";
import HomePage from "#pages/HomePage";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const App = () => {
	return (
		<main className="root">
			<div className="flex flex-1">
				<Sidebar />
				<div className="flex-1">
					<Topbar />
					<Switch>
						<Route path="/" component={HomePage} />
					</Switch>
				</div>
			</div>
			<Footer />
		</main>
	);
};

export default App;
