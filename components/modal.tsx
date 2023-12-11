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
        ${open ? "visible bg-black/20" : "invisible"} 
    `}
    >
      <div>
        <button onClick={() => onClose()}>Close</button>
      </div>
      <div>{children}</div>
    </div>
  );
};