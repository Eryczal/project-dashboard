import { ReactNode } from "react";

export default function ModalFooter({ children }: { children: ReactNode }) {
    return <div className="modal-footer">{children}</div>;
}
