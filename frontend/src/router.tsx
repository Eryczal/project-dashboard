import { createBrowserRouter } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import UserProjectsPage from "./pages/UserProjectsPage";
import AuthPage from "./pages/AuthPage";
import { ProjectProvider } from "./contexts/ProjectContext";
import LabelsPage from "./pages/LabelsPage";
import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter(
    [
        {
            path: "/projects",
            element: <UserProjectsPage />,
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
        {
            path: "*",
            element: <NotFoundPage />,
        },
    ],
    {
        basename: import.meta.env.VITE_BASENAME,
    }
);
