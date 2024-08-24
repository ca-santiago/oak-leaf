'use client';

import React from "react";
import { useStepFollower } from "@/components/habit-creation-flow/manager";
import { PiPlus } from "react-icons/pi";

interface HabitCreationFlowProps { }

function HabitCreationFlow (_: HabitCreationFlowProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const SF = useStepFollower();

  return (
    <div className="px-2 py-2 border-gray-300 rounded border-dotted border-2 bg-gray-502 bg-white text-gray-500">
      <div>
        <PiPlus onClick={() => setIsOpen(true)} />
      </div>
      { isOpen && 
        <div onClick={ () => setIsOpen(false) } className="z-50 bg-black/50 flex items-center justify-center fixed top-0 bottom-0 left-0 right-0">
          <div
            onClick={ e => e.stopPropagation() }
            className="w-[500px] h-fit bg-white border-2 rounded-lg p-4"
            >
            <SF.Component />
          </div>
        </div>
      }
    </div>
  );
}

export default HabitCreationFlow;
