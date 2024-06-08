import { useState } from "react";
import { SelectableLabelProps } from "../../types";

function SelectableLabel({ label, handleLabel }: SelectableLabelProps) {
    const [clicked, setClicked] = useState<boolean>(false);

    const handleClick = (): void => {
        handleLabel(!clicked, label.id);
        setClicked(!clicked);
    };

    return (
        <div onClick={handleClick} className={`modal-label${clicked ? " modal-label-selected" : ""}`}>
            <div className="label-text-container">
                <div className="label-text">{label.title}</div>
            </div>
        </div>
    );
}

export default SelectableLabel;
