import { createBrowserRouter, Navigate } from "react-router-dom";
import TaskPage from "./pages/TaskPage";
import AuthPage from "./pages/AuthPage";
import { ProjectProvider } from "./contexts/ProjectContext";
import LabelsPage from "./pages/LabelsPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import BudgetPage from "./pages/BudgetPage";
import UserLoginPage from "./modules/user/UserLogin/pages/UserLoginPage/UserLoginPage";
import NotFoundPage from "./modules/common/pages/NotFoundPage/NotFoundPage";
import ProjectsPage from "./modules/project/Projects/pages/ProjectsPage/ProjectsPage";
import { ProjectsProvider } from "./modules/project/contexts/ProjectsContext";

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
            path: "/:companyId/projects",
            element: (
                <ProjectsProvider>
                    <ProjectsPage />
                </ProjectsProvider>
            ),
        },
        {
            path: "/404",
            element: <NotFoundPage />,
        },
        {
            path: "*",
            element: <Navigate to="/404" replace />,
        },
    ],
    {
        basename: import.meta.env.VITE_BASENAME,
    }
);
