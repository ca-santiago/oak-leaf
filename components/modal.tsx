interface ModalProps {
  open: boolean;
  onClose: () => any;
  children: React.ReactNode;
}

export const Modal = ({ children, onClose, open }: ModalProps) => {
  return (
    <div
      className={`
        fixed inset-0 flex justify-center items-center transition-colors
        ${open ? "visible bg-black/30" : "invisible"}
    `}
      onClick={() => onClose()}
    >
      <div onClick={(e) => e?.stopPropagation()} className="z-50">
        {children}
      </div>
    </div>
  );
};
