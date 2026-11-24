"use client";

import { useMemo, useState } from "react";

import {
  BUILD_TERMS,
  calculateTotal,
  createInitialSelection,
  getCalculatorRows,
  type BuildTerm,
  type ContactChannel,
  type LandOption,
} from "./calculator";

export function useCalculator() {
  const [selected, setSelected] = useState(createInitialSelection);
  const [term, setTerm] = useState<BuildTerm>(BUILD_TERMS[0]);
  const [land, setLand] = useState<LandOption>("Да, участок есть");
  const [channel, setChannel] = useState<ContactChannel>("max");

  const total = useMemo(() => calculateTotal(selected), [selected]);
  const rows = useMemo(() => getCalculatorRows(selected), [selected]);

  const choose = (groupIndex: number, optionIndex: number) => {
    setSelected((current) =>
      current.map((value, index) =>
        index === groupIndex ? optionIndex : value,
      ),
    );
  };

  const reset = () => setSelected(createInitialSelection());

  return {
    selected,
    term,
    land,
    channel,
    total,
    rows,
    setTerm,
    setLand,
    setChannel,
    choose,
    reset,
  };
}
