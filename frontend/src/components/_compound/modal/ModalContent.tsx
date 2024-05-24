import { ReactNode } from "react";

export default function ModalContent({ children }: { children: ReactNode }) {
    return <div className="modal-content">{children}</div>;
}
