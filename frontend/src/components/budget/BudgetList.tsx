import { useProject } from "../../contexts/ProjectContext";
import { getBudget } from "../../data/budget";
import { Budget, BudgetType } from "../../types";
import "./BudgetList.css";
import { useEffect, useState } from "react";
import BudgetModal from "./BudgetModal";

export default function BudgetList({ type }: { type: BudgetType }) {
    const { project } = useProject();
    const [reload, setReload] = useState<boolean>(true);
    const [budget, setBudget] = useState<Budget[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    if (!project) {
        return <></>;
    }

    const openModal = (): void => {
        setIsOpen(true);
    };

    const closeModal = (success: boolean = false): void => {
        setIsOpen(false);

        if (success) {
            setReload(true);
        }
    };

    useEffect(() => {
        if (project && reload) {
            const loadBudget = async () => {
                const budgetData = await getBudget(project.id, type);

                if (budgetData && !("message" in budgetData)) {
                    setBudget(budgetData.budget);
                }

                setReload(false);
            };

            loadBudget().catch(console.error);
        }
    }, [project, reload]);

    return (
        <>
            <div>
                <table>
                    <caption>{type === "income" ? "Przychody" : "Wydatki"}</caption>
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Nazwa</th>
                            <th>Kwota</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
                <button onClick={openModal}>Dodaj {type === "income" ? "przychód" : "wydatek"}</button>
            </div>
            {isOpen && <BudgetModal onClose={closeModal} type={type} />}
        </>
    );
}
