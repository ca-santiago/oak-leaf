import React from "react";
import { MdEdit } from "react-icons/md";
import { BsTrash2Fill } from "react-icons/bs";

interface Props {
  onDeleteClick?: () => any;
  onEditClick?: () => any;
}

const EditHabitFloatingPanel = ({ onDeleteClick, onEditClick }: Props) => {
  return (
    <div className="hidden md:block absolute top-10 right-0 translate-x-2 hover:translate-x-10 duration-150 ease-in-out select-none">
      <div className="w-10 hover:h-fit bg-slate-500 duration-150 ease-in-out hover:bg-slate-600 flex items-center justify-center rounded-r-md cursor-pointer py-2">
        <div className="flex flex-col gap-2">
          <BsTrash2Fill
            onClick={(e: React.SyntheticEvent) => {
              e.stopPropagation();
              onDeleteClick?.();
            }}
            size={20}
            className="text-red-400 rounded-full hover:bg-slate-500 p-1 w-fit h-fit"
          />
          <MdEdit
            onClick={(e: React.SyntheticEvent) => {
              e.stopPropagation();
              onEditClick?.();
            }}
            size={18}
            className="text-slate-50 rounded-full hover:bg-slate-500 p-1 w-fit h-fit"
          />
        </div>
      </div>
    </div>
  );
};

export default EditHabitFloatingPanel;
