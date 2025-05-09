import { useNavigate } from "react-router-dom";
import { Field, FilledField } from "../../../../../types";
import GenericForm from "../../../../common/components/GenericForm/GenericForm";
import { useUser } from "../../../contexts/useUser";
import styles from "./UserLoginForm.module.css";

export default function UserLoginForm() {
    const { loginUser } = useUser();
    const navigate = useNavigate();

    const fields: Field[] = [
        {
            key: "name",
            label: "Nazwa",
            required: true,
        },
        {
            key: "password",
            label: "Hasło",
            type: "password",
            required: true,
        },
    ];

    const onSubmit = async (fields: FilledField[]): Promise<void> => {
        const name = fields.find((field) => field.key === "name");
        const password = fields.find((field) => field.key === "password");

        if (!name || !password) {
            return;
        }

        const response = await loginUser(name.value, password.value);

        if (response === "OK") {
            navigate("/projects");
        }
    };

    return (
        <div className={styles.formContainer}>
            <GenericForm headerText="Logowanie" buttonText="Zaloguj" fields={fields} onSubmit={onSubmit} />
        </div>
    );
}
