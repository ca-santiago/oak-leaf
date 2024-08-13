import React from "react";
import moment from "moment";
import cx from 'classnames';

const daysOfWeekSortName = moment.weekdaysMin(true);

interface Props {
  initialSelection?: Array<number>;
  onSelectionChange?: (newSelection: number[]) => any;
}

function DayOfWeekSelector(props: Props) {
  const [selected, setSelected] = React.useState(new Set(props.initialSelection));

  const handleChipClick = (index: number, isSelected: boolean) => {
    const newSelection = new Set(selected);
    isSelected ? newSelection.delete(index) : newSelection.add(index);
    if (props.onSelectionChange) props.onSelectionChange(Array.from(newSelection));

    setSelected(newSelection);
  };

  return (
  <div className="flex gap-2 mt-2">
    { daysOfWeekSortName.map((dayString, index) => {
        const isSelected = selected.has(index);
        const classes = cx({
          'rounded-lg border px-3 py-1 font-semibold text-xs': true,
          'bg-slate-600 text-white border-slate-600': isSelected,
          'bg-white text-slate-400 border-slate-300': !isSelected,
        });
        return (
          <button
            className={ classes }
            onClick={ () => handleChipClick(index, isSelected) }
            key={ index }
          >
            { dayString }
          </button>
        );
      })
    }
    </div>
  );
}

export default DayOfWeekSelector;
