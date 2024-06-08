import { MenuItemProps } from "../../../types";

export default function MenuItem({ children, action }: MenuItemProps) {
    return (
        <div className="menu-item" onClick={action}>
            {children}
        </div>
    );
}
