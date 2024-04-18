import { createBrowserRouter } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import ProjectPage from "./pages/ProjectPage";

export const router = createBrowserRouter(
    [
        {
            path: "/",
            element: <ProjectPage />,
        },
        {
            path: "/project/:id",
            element: <TaskPage />,
        },
    ],
    {
        basename: "/Strony/project-dashboard/frontend",
    }
);
