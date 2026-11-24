import { CALCULATOR_GROUPS } from "../../model/options";
import { OptionCard } from "./OptionCard";

interface OptionsGroupProps {
  selected: number[];
  onChoose: (groupIndex: number, optionIndex: number) => void;
}

export function OptionsGroup({ selected, onChoose }: OptionsGroupProps) {
  return (
    <div id="groups">
      {CALCULATOR_GROUPS.map((group, groupIndex) => (
        <section className="opt-group reveal visible" key={group.t}>
          <div className="opt-group-head">
            <span className="opt-num">{groupIndex + 1}</span>
            <span className="opt-title">{group.t}</span>
          </div>
          <div className="opt-variants">
            {group.opts.map((option, optionIndex) => (
              <OptionCard
                key={option.n}
                option={option}
                selected={selected[groupIndex] === optionIndex}
                onSelect={() => onChoose(groupIndex, optionIndex)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
