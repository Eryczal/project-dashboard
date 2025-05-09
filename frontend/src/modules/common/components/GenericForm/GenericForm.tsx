import { useState } from "react";
import { FilledField, GenericFormProps } from "../../../../types";
import styles from "./GenericForm.module.css";

export default function GenericForm({ headerText, buttonText, fields, onSubmit }: GenericFormProps) {
    const [formData, setFormData] = useState<FilledField[]>(() => fields.map((field) => ({ key: field.key, value: "" })));

    const handleChange = (key: string, value: string) => {
        setFormData((prev) => prev.map((field) => (field.key === key ? { ...field, value } : field)));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getValue = (key: string) => formData.find((field) => field.key === key)?.value || "";

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h1>{headerText}</h1>
            {fields.map((field) => (
                <div key={field.key} className={styles.field}>
                    <label>{field.label}</label>
                    <input
                        type={field.type || "text"}
                        className={styles.input}
                        value={getValue(field.key)}
                        required={field.required}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                    />
                </div>
            ))}
            <button type="submit" className={styles.submit}>
                {buttonText}
            </button>
        </form>
    );
}
