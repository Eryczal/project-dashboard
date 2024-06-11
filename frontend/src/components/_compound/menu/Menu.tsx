import { ReactNode } from "react";
import "./Menu.css";
import MenuItem from "./MenuItem";

export default function Menu({ children }: { children: ReactNode }) {
    const preventDefault = (event: React.MouseEvent) => {
        event.stopPropagation();
    };

    return (
        <div className="menu" onMouseDown={preventDefault}>
            {children}
        </div>
    );
}

Menu.item = MenuItem;
