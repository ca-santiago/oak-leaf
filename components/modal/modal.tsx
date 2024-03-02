import classNames from "classnames";
import { MouseEvent } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => any;
  children: React.ReactNode;
}

const stopPropagation = (e: MouseEvent<any>) => e?.stopPropagation();

export const Modal = ({ children, onClose, open }: ModalProps) => {
  if (!open) return null;
  const cx = classNames("fixed inset-0 transition-colors z-50", {
    ["visible bg-black/30"]: open,
    invisible: !open,
  });
  return (
    <div
      className={cx}
      onMouseDown={(e) => {
        stopPropagation(e);
        onClose();
      }}
      onClick={stopPropagation}
    >
      {children}
    </div>
  );
};
