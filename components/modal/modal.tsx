import { MouseEvent } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => any;
  children: React.ReactNode;
}

const stopPropagation = (e: MouseEvent<any>) => e?.stopPropagation();

export const Modal = ({ children, onClose, open }: ModalProps) => {
  if(!open) return null;
  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center transition-colors z-50
        ${open ? "visible bg-black/30" : "invisible"}
    `}
      onMouseDown={() => onClose()}
    >
      <div onMouseDown={stopPropagation} onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
};
