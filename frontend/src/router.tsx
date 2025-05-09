import { createBrowserRouter } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import AuthPage from "./pages/AuthPage";
import { ProjectProvider } from "./contexts/ProjectContext";
import LabelsPage from "./pages/LabelsPage";
import NotFoundPage from "./pages/NotFoundPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import BudgetPage from "./pages/BudgetPage";
import UserLoginPage from "./modules/user/UserLogin/pages/UserLoginPage/UserLoginPage";

export const router = createBrowserRouter(
    [
        {
            path: "/dashboard",
            element: <DashboardPage />,
        },
        {
            path: "/settings",
            element: <SettingsPage />,
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
            path: "/project/:id/budget",
            element: (
                <ProjectProvider>
                    <BudgetPage />
                </ProjectProvider>
            ),
        },
        {
            path: "/register",
            element: <AuthPage routerPage="register" />,
        },
        {
            path: "/login",
            element: <UserLoginPage />,
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
