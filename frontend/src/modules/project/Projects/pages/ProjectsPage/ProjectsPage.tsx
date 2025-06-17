import { Link } from "react-router-dom";
import { useProjects } from "../../../contexts/useProjects";
import CreateProjectDialogHandler from "../../components/CreateProjectDialogHandler/CreateProjectDialogHandler";

export default function ProjectsPage() {
    const { projects } = useProjects();

    return (
        <main>
            <h1>Projekty</h1>
            {projects?.map((project) => {
                return (
                    <p key={project.url}>
                        <Link to={`/project/${project.url}`}>{project.name}</Link>
                    </p>
                );
            })}
            <CreateProjectDialogHandler />
        </main>
    );
}
