import "./App.css";
import { Toast } from "@base-ui/react";
import { Route, Switch } from "wouter";
import HomePage from "#pages/HomePage";
import InboxPage from "#pages/InboxPage";
import ProjectPage from "#pages/ProjectPage";
import ProjectsPage from "#pages/ProjectsPage";
import TasksPage from "#pages/TasksPage";
import ToastList from "#ui/ToastsList";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const App = () => {
	return (
		<Toast.Provider>
			<main className="root">
				<div className="flex flex-1">
					<Sidebar />
					<div className="flex-1">
						<Topbar />
						<div className="p-sm">
							<Switch>
								<Route path="/" component={HomePage} />
								<Route path="/inbox" component={InboxPage} />
								<Route
									path="/projects"
									component={ProjectsPage}
								/>
								<Route
									path="/projects/:name"
									component={ProjectPage}
								/>
								<Route path="/tasks" component={TasksPage} />
							</Switch>
						</div>
					</div>
				</div>
				<Footer />
			</main>
			<Toast.Portal>
				<Toast.Viewport className="fixed top-auto right-[1rem] bottom-[1rem] z-10 mx-auto flex w-[250px] sm:right-[2rem] sm:bottom-[2rem] sm:w-[300px]">
					<ToastList />
				</Toast.Viewport>
			</Toast.Portal>
		</Toast.Provider>
	);
};

export default App;
