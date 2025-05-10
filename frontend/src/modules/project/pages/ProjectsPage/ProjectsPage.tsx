import { useNavigate } from "react-router-dom";
import { useProjects } from "../../contexts/useProjects";

export default function ProjectsPage() {
    const navigate = useNavigate();
    const { projects } = useProjects();

    if (projects === null) {
        navigate("/login");
    }

    return (
        <main>
            <h1>Projekty</h1>
        </main>
    );
}
