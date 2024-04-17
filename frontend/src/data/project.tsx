import { Column } from "./column";

export interface Project {
    id: number;
    title: string;
    description: string;
    columns?: Column[];
}

const projects = [
    {
        id: 0,
        title: "Test project",
        description: "Project description",
    },
    {
        id: 1,
        title: "Second project",
        description: "Project description",
    },
];

export function getUserProjects(): Project[] {
    const projectData = projects;

    return projectData;
}

export function getProjectById(id: number): Project | undefined {
    const project = projects.find((project) => project.id === id);

    return project;
}
