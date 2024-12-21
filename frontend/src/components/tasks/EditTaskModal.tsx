import "./TaskModal.css";
import { ChangeEvent, useEffect, useState } from "react";
import { DurationType, EditTaskData, TaskColumnModal, TaskModalProps } from "../../types";
import Modal from "../_compound/modal/Modal";
import LabelSelection from "./LabelSelection";
import { updateTask } from "../../data/task";
import { getDate } from "../../helper";

function EditTaskModal({ onClose, task }: TaskModalProps) {
    const [title, setTitle] = useState<string>(task?.title || "");
    const [description, setDescription] = useState<string>(task?.description || "");
    const [duration, setDuration] = useState<string>(String(task?.duration) || "0");
    const [durationType, setDurationType] = useState<DurationType>("h");
    const [deadline, setDeadline] = useState<string>(task?.deadline || "0");
    const [labels, setLabels] = useState<string[]>(task?.labels || []);

    const hours: number = 24;
    const days: number = 31;

    const minDate: string = getDate("min");
    const maxDate: string = getDate("max");

    if (!task) {
        return <></>;
    }

    useEffect(() => {
        if (task.duration >= 24) {
            setDuration(String(Math.floor(task.duration / 24)));
            setDurationType("d");
        }
    }, []);

    const closeModal = (success: TaskColumnModal = "none"): void => {
        onClose(success);
    };

    const editTask = async () => {
        const parsedDuration: number = durationType === "h" ? parseInt(duration) : parseInt(duration) * 24;

        if (
            title === task.title &&
            description === task.description &&
            JSON.stringify(labels) === JSON.stringify(task.labels) &&
            deadline === task.deadline &&
            parsedDuration === task.duration
        ) {
            return;
        }

        const labelsAdd = labels.filter((label) => !task.labels?.includes(label));
        const labelsRemove = task.labels?.filter((label) => !labels.includes(label)) || [];

        let sendData: EditTaskData = {
            title: title === task.title ? false : title,
            description: description === task.description ? false : description,
            deadline: deadline === task.deadline ? false : deadline,
            duration: parsedDuration === task.duration ? false : parsedDuration,
            labelsAdd: labelsAdd.length === 0 ? false : labelsAdd,
            labelsRemove: labelsRemove.length === 0 ? false : labelsRemove,
        };

        let edited = await updateTask(task.id, sendData);

        if (edited.code === 200) {
            closeModal("edit");
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

    return (
        <Modal onClose={closeModal} className="task-modal">
            <Modal.Title>
                <h1>Edytuj zadanie</h1>
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
                <LabelSelection handleLabel={handleLabel} activeLabels={task.labels} />
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal()}>Anuluj</button>
                <button onClick={editTask}>Edytuj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default EditTaskModal;
