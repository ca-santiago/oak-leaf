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
      className={ cx }
      onMouseDown={(e) => {
        stopPropagation(e);
        onClose();
      }}
      onClick={ stopPropagation }
    >
      <div
        className="absolute left-0 right-0 max-md:bottom-0 md:top-20 lg:top-40 w-full md:w-4/6 lg:w-2/4 xl:w-2/5 mx-auto bg-white shadow rounded-md max-md:rounded-b-none"
        onMouseDown={ stopPropagation }
        onClick={ stopPropagation }
      >
        { children }
      </div>
    </div>
  );
};
