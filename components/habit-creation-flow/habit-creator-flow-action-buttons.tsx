import { FaArrowCircleLeft } from "react-icons/fa";
import { useHabitCreatorActions } from "./manager";


function HabitCreatorFlowActionButtons() {
  const {
    canGoNext,
    canGoPrev,
    goNext,
    goPrev,
  } = useHabitCreatorActions();

  return (
    <div className="grid grid-cols-2 justify-between">
      <div className="w-full flex items-center justify-start">
        <button
          className="w-4 h-4 text-slate-400 disabled:text-slate-300 hover:text-slate-500 select-none rounded-full shadow disabled:shadow-none" 
          disabled={ !canGoPrev }
          onClick={ () => goPrev() }
        >
          <FaArrowCircleLeft size={ 28 } className="" />
        </button>            
      </div>
      <div className="w-full flex justify-end">
        <button
            className="w-fit px-3 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm disabled:bg-gray-200 select-none"
            disabled={ !canGoNext }
            onClick={ () => goNext() }
            >
            Continuar
        </button>  
      </div>
    </div>
  );
}

export default HabitCreatorFlowActionButtons;