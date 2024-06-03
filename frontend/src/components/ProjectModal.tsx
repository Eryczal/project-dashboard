import "./ProjectModal.css";
import { ChangeEvent, useState } from "react";
import { ModalProps } from "../types";
import Modal from "./_compound/modal/Modal";
import { createProject } from "../data/project";

const publicityInfo = [
    "Nikt oprócz ciebie nie będzie miał dostępu do tego projektu",
    "Tylko zatwierdzone przez ciebie osoby będą miały dostęp do projektu",
    "Każda osoba mająca link będzie miała dostęp do tego projektu",
];

function ProjectModal({ onClose }: ModalProps) {
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [publicity, setPublicity] = useState<number>(0);

    const closeModal = (success: boolean = false): void => {
        onClose(success);
    };

    const addProject = async () => {
        let created = await createProject(title, description, publicity);
        if ("code" in created && created.code === 201) {
            closeModal(true);
        }
    };

    const handleTitle = (event: ChangeEvent<HTMLInputElement>): void => {
        setTitle(event.target.value);
    };

    const handleDescription = (event: ChangeEvent<HTMLTextAreaElement>): void => {
        setDescription(event.target.value);
    };

    const handlePublicity = (event: ChangeEvent<HTMLSelectElement>): void => {
        setPublicity(parseInt(event.target.value));
    };

    return (
        <Modal onClose={closeModal} className="project-modal">
            <Modal.Title>
                <h1>Stwórz projekt</h1>
            </Modal.Title>
            <Modal.Content>
                <p>Nazwa</p>
                <input type="text" onChange={handleTitle} value={title} />
                <p>Opis</p>
                <textarea onChange={handleDescription} value={description}></textarea>
                <p>Dostęp</p>
                <select value={publicity} onChange={handlePublicity}>
                    <option value="0">Prywatny</option>
                    <option value="1">Ograniczony</option>
                    <option value="2">Publiczny</option>
                </select>
                <p>{publicityInfo[publicity]}</p>
            </Modal.Content>
            <Modal.Footer>
                <button onClick={() => closeModal(false)}>Anuluj</button>
                <button onClick={addProject}>Dodaj</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ProjectModal;
