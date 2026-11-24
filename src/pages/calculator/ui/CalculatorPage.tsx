"use client";

import { CalculatorHeader } from "./components/CalculatorHeader";
import { BaseConfiguration } from "./components/BaseConfiguration";
import { OptionsGroup } from "./components/OptionsGroup";
import { CalculatorSummary } from "./components/CalculatorSummary";
import { CalculatorMobileBar } from "./components/CalculatorMobileBar";
import { CalculatorLeadSection } from "./components/CalculatorLeadSection";
import { useCalculator } from "../lib/useCalculator";

export function CalculatorPage() {
  const calculator = useCalculator();

  return (
    <main className="calculator-page">
      <CalculatorHeader />
      <div className="calc-shell">
        <div className="calc-grid">
          <div className="calc-main">
            <BaseConfiguration />
            <OptionsGroup
              selected={calculator.selected}
              onChoose={calculator.choose}
            />
          </div>
          <CalculatorSummary
            total={calculator.total}
            rows={calculator.rows}
            onReset={calculator.reset}
          />
        </div>

        <CalculatorLeadSection
          total={calculator.total}
          rows={calculator.rows}
          term={calculator.term}
          land={calculator.land}
          channel={calculator.channel}
          onTermChange={calculator.setTerm}
          onLandChange={calculator.setLand}
          onChannelChange={calculator.setChannel}
        />
      </div>
      <CalculatorMobileBar total={calculator.total} />
    </main>
  );
}
