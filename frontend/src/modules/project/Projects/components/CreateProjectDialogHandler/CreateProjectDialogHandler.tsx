import { useState } from "react";
import { Field, FilledField } from "../../../../../types";
import GenericDialog from "../../../../common/components/GenericDialog/GenericDialog";
import GenericForm from "../../../../common/components/GenericForm/GenericForm";
import { useProjects } from "../../../contexts/useProjects";

export default function CreateProjectDialogHandler() {
    const { createProject } = useProjects();
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

    const createProjectFormFields: Field[] = [
        {
            key: "name",
            label: "Nazwa",
            required: true,
        },
        {
            key: "url",
            label: "Adres url",
        },
    ];

    const onClose = () => {
        setIsDialogOpen(false);
    };

    const toggleDialog = () => {
        setIsDialogOpen((prev) => !prev);
    };

    const handleCreateProjectFormSubmit = async (fields: FilledField[]): Promise<void> => {
        const name = fields.find((field) => field.key === "name");
        const url = fields.find((field) => field.key === "url");

        if (!name) {
            return;
        }

        await createProject(name.value, url?.value || "");
    };

    return (
        <>
            <GenericDialog isOpen={isDialogOpen} onClose={onClose}>
                <GenericForm headerText="Nowy projekt" buttonText="Stwórz" fields={createProjectFormFields} onSubmit={handleCreateProjectFormSubmit} />
            </GenericDialog>
            <button onClick={toggleDialog}>Stwórz projekt</button>
        </>
    );
}
