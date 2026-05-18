import "./App.css";
import { Route, Switch } from "wouter";
import HomePage from "#pages/HomePage";
import ProjectPage from "#pages/ProjectPage";
import ProjectsPage from "#pages/ProjectsPage";
import TasksPage from "#pages/TasksPage";
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
					<div className="p-sm">
						<Switch>
							<Route path="/" component={HomePage} />
							<Route path="/projects" component={ProjectsPage} />
							<Route
								path="/projects/:name"
								component={ProjectPage}
							/>
							<Route path="/tasks/:name" component={TasksPage} />
						</Switch>
					</div>
				</div>
			</div>
			<Footer />
		</main>
	);
};

export default App;
