import { createBrowserRouter } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import ProjectPage from "./pages/ProjectPage";
import AuthPage from "./pages/AuthPage";
import { ProjectProvider } from "./contexts/ProjectContext";
import LabelsPage from "./pages/LabelsPage";

export const router = createBrowserRouter(
    [
        {
            path: "/projects",
            element: <ProjectPage />,
        },
        {
            path: "/project/:id/labels",
            element: (
                <ProjectProvider>
                    <LabelsPage />
                </ProjectProvider>
            ),
        },
        {
            path: "/project/:id/tasks",
            element: (
                <ProjectProvider>
                    <TaskPage />
                </ProjectProvider>
            ),
        },
        {
            path: "/register",
            element: <AuthPage routerPage="register" />,
        },
        {
            path: "/login",
            element: <AuthPage routerPage="login" />,
        },
    ],
    {
        basename: import.meta.env.VITE_BASENAME,
    }
);
