import "./BudgetModal.css";
import { ChangeEvent, useState } from "react";
import { useProject } from "../../contexts/ProjectContext";
import { BudgetType, ModalProps, Task } from "../../types";
import Modal from "../_compound/modal/Modal";
import { createBudget } from "../../data/budget";

function BudgetModal({ onClose, type }: ModalProps & { type: BudgetType }) {
    const { project } = useProject();
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [amount, setAmount] = useState<string>("");
    const [task, setTask] = useState<Task | null>(null);

    if (!project) {
        return <></>;
    }

    const closeModal = (success: boolean = false): void => {
        onClose(success);
    };

    const addBudget = async () => {
        // let created = await createBudget(project.id, title, description, amount, task);
        // if (created.code === 201) {
        //     closeModal(true);
        // }
    };

    const handleTitle = (event: ChangeEvent<HTMLInputElement>): void => {
        setTitle(event.target.value);
    };

    const handleDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(event.target.value);
    };

    const handleAmount = (event: ChangeEvent<HTMLInputElement>): void => {
        const isNumber = /^-?\d+$/;

        if (isNumber.test(event.target.value)) {
            setAmount(event.target.value);
        }
    };

    return (
        <>
            <Modal onClose={closeModal}>
                <Modal.Title>
                    <h1>Dodaj {type === "income" ? "przychód" : "wydatek"}</h1>
                </Modal.Title>
                <Modal.Content>
                    <p>Nazwa</p>
                    <input type="text" onChange={handleTitle} value={title} />
                    <p>Opis</p>
                    <textarea onChange={handleDescription} value={description}></textarea>
                    <p>Wartość</p>
                    <input type="number" onChange={handleAmount} value={amount} />
                    <p>Połączone zadanie</p>
                </Modal.Content>
                <Modal.Footer>
                    <button onClick={() => closeModal(false)}>Anuluj</button>
                    <button onClick={addBudget}>Dodaj</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default BudgetModal;
