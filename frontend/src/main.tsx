import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProjectPage from "./pages/ProjectPage.tsx";
import TaskPage from "./pages/TaskPage.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <ProjectPage />,
    },
    {
        path: "/project/:id",
        element: <TaskPage />,
    },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
