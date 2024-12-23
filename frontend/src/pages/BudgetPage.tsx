import "./BudgetPage.css";
import ProjectHeader from "../components/ProjectHeader";
import Aside from "../components/Aside";
import { useProject } from "../contexts/ProjectContext";
import BudgetList from "../components/budget/BudgetList";

function BudgetPage() {
    const { project } = useProject();

    if (project === undefined) {
        return <>Błąd</>;
    }

    return (
        <div className="budget-page-container">
            <Aside />
            <div className="budget-page">
                <ProjectHeader />
                <main>
                    <div className="budget-overview">
                        <div className="budget-card">
                            <h2>Dostępne środki</h2>
                            <p>50zł</p>
                        </div>
                        <div className="budget-card">
                            <h2>Całkowite wpływy</h2>
                            <p>100zł</p>
                        </div>
                        <div className="budget-card">
                            <h2>Całkowite wydatki</h2>
                            <p>50zł</p>
                        </div>
                    </div>
                    <BudgetList type="income" />
                    <BudgetList type="expense" />
                </main>
            </div>
        </div>
    );
}

export default BudgetPage;
