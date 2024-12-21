import "./TaskModal.css";
import { ChangeEvent, useEffect, useState } from "react";
import { DurationType, TaskColumnModal, TaskModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import LabelSelection from "./LabelSelection";
import { createTask } from "../../data/task";

function TaskModal({ onClose, column, pos }: TaskModalProps) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [durationType, setDurationType] = useState<DurationType>("h");
    const [deadline, setDeadline] = useState<string>("");
    const [labels, setLabels] = useState<string[]>([]);

    const hours: number = 24;
    const days: number = 31;

    const getDate = (type: "min" | "max"): string => {
        const date = new Date();
        const year: string = String(date.getFullYear() + (type === "min" ? 0 : 5));
        const month: string = String(date.getMonth() + 1).padStart(2, "0");
        const day: string = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const minDate: string = getDate("min");
    const maxDate: string = getDate("max");

    useEffect(() => {
        setDeadline(getDate("min"));
    }, []);

    if (!column || pos === undefined) {
        return <></>;
    }

    if (deadline === "" || minDate === "" || maxDate === "") {
        return <></>;
    }

    const closeModal = (success: TaskColumnModal = "none"): void => {
        onClose(success);
    };

    const addTask = async () => {
        let created = await createTask(column.id, title, description, duration, durationType, deadline, labels, pos);

        if (created.code === 201) {
            closeModal("task");
        }
    };

    const handleTitle = (event: ChangeEvent<HTMLInputElement>): void => {
        setTitle(event.target.value);
    };

    const handleDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(event.target.value);
    };

    const handleLabel = (clicked: boolean, labelId: string): void => {
        if (clicked) {
            setLabels((prevLabels) => [...prevLabels, labelId]);
        } else {
            setLabels((prevLabels) => prevLabels.filter((l) => l !== labelId));
        }
    };

    const handleDuration = (event: ChangeEvent<HTMLSelectElement>): void => {
        setDuration(event.target.value);
    };

    const handleDurationType = (event: ChangeEvent<HTMLSelectElement>): void => {
        if (event.target.value === "d" || event.target.value === "h") {
            setDuration("0");
            setDurationType(event.target.value);
        }
    };

    const handleDeadline = (event: ChangeEvent<HTMLInputElement>): void => {
        setDeadline(event.target.value);
    };

    if (!column) {
        return <></>;
    }

    return (
        <Modal onClose={closeModal} className="task-modal">
            <Modal.Title>
                <h1>Dodaj zadanie</h1>
                <p>Kolumna {column.title}</p>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
                <p>Czas trwania:</p>
                <select value={duration} onChange={handleDuration}>
                    {[...Array(durationType === "h" ? hours : days).keys()].map((item) => {
                        return (
                            <option key={item} value={item}>
                                {item}
                            </option>
                        );
                    })}
                </select>
                <select value={durationType} onChange={handleDurationType}>
                    <option value={"h"}>godzin</option>
                    <option value={"d"}>dni</option>
                </select>
                <p>Termin skończenia:</p>
                <input type="date" value={deadline} min={minDate} max={maxDate} onChange={handleDeadline} />
                <p>Etykiety</p>
                <LabelSelection handleLabel={handleLabel} />
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal()}>Anuluj</button>
                <button onClick={addTask}>Dodaj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default TaskModal;
