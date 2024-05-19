import { ReactNode } from "react";

export default function ModalTitle({ children }: { children: ReactNode }) {
    return <div className="modal-title">{children}</div>;
}
