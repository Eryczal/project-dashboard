import { createBrowserRouter } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import ProjectPage from "./pages/ProjectPage";
import AuthPage from "./pages/AuthPage";

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
