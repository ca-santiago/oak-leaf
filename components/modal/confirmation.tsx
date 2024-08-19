import { Modal } from "./modal";

interface Props {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  className?: string;
}

export const ConfirmationModal = ({
  show,
  onConfirm,
  onCancel,
  title,
  className
}: Props) => {
  return (
    <Modal open={show} onClose={onCancel}>
      <div className={`flex flex-col items-center justify-center p-4 w-full mb-2 ${className}`}>
        <h3 className="text-md text-slate-600 font-semibold">{title}</h3>
        <div className="flex flex-row gap-2 mt-8 w-full">
          <button
            onClick={onCancel}
            className="bg-red-500 hover:bg-red-700 text-white text-sm font-semibold py-2 px-2 rounded w-full"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-2 rounded w-full"
          >
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};
