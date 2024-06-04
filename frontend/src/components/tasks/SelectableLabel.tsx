import { useState } from "react";
import { SelectableLabelProps } from "../../types";

function SelectableLabel({ label, handleLabel }: SelectableLabelProps) {
    const [clicked, setClicked] = useState<boolean>(false);

    const handleClick = (): void => {
        handleLabel(!clicked, label.id);
        setClicked(!clicked);
    };

    return (
        <div onClick={handleClick}>
            <p>Nazwa: {label.title}</p>
            <p>Kliknięty: {clicked.toString()}</p>
        </div>
    );
}

export default SelectableLabel;
