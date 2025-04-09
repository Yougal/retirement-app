import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
  } from 'chart.js';
  
  // Register necessary components
  ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
  );
const RetirementPlanner = () => {
  const [portfolioBalance, setPortfolioBalance] = useState(2000000);
  const [annualExpenses, setAnnualExpenses] = useState(300000);
  const [nonPortfolioIncome, setNonPortfolioIncome] = useState(500000);
  const [startingAge, setStartingAge] = useState(60);
  const [roi, setRoi] = useState(4);
  const [taxRate, setTaxRate] = useState(20);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [projections, setProjections] = useState([]);

  const calculateProjections = () => {
    const results = [];
    let currentBalance = portfolioBalance;
    let currentExpenses = annualExpenses;

    for (let age = startingAge; age <= 90; age++) {
      const portfolioGrowth = (currentBalance * roi) / 100;
      const withdrawal = Math.max(currentExpenses - nonPortfolioIncome, 0);
      const taxes = (withdrawal * taxRate) / 100;
      const remainingBalance = currentBalance - withdrawal - taxes + portfolioGrowth;

      results.push({
        age,
        portfolioValue: currentBalance,
        withdrawal,
        taxes,
        portfolioGrowth,
        remainingBalance,
      });

      currentBalance = remainingBalance;
      currentExpenses *= 1 + inflationRate / 100;
    }

    setProjections(results);
  };

  useEffect(() => {
    calculateProjections();
  }, [portfolioBalance, annualExpenses, nonPortfolioIncome, startingAge, roi, taxRate, inflationRate]);

  const data = {
    labels: projections.map((p) => p.age),
    datasets: [
      {
        label: "Portfolio Value",
        data: projections.map((p) => p.portfolioValue),
        borderColor: "blue",
        fill: false,
      },
    ],
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Retirement Planner</h1>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Portfolio Balance</label>
          <input
            type="number"
            value={portfolioBalance}
            onChange={(e) => setPortfolioBalance(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Annual Expenses</label>
          <input
            type="number"
            value={annualExpenses}
            onChange={(e) => setAnnualExpenses(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Non-Portfolio Income</label>
          <input
            type="number"
            value={nonPortfolioIncome}
            onChange={(e) => setNonPortfolioIncome(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Starting Age</label>
          <input
            type="number"
            value={startingAge}
            onChange={(e) => setStartingAge(Number(e.target.value))}
          />
        </div>
        <div>
          <label>ROI (%)</label>
          <input
            type="number"
            value={roi}
            onChange={(e) => setRoi(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Tax Rate (%)</label>
          <input
            type="number"
            value={taxRate}
            onChange={(e) => setTaxRate(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Inflation Rate (%)</label>
          <input
            type="number"
            value={inflationRate}
            onChange={(e) => setInflationRate(Number(e.target.value))}
          />
        </div>
      </div>
      <button onClick={calculateProjections} className="mt-4 p-2 bg-blue-500 text-white">
        Calculate
      </button>
      <div className="mt-8">
        <h2 className="text-xl font-bold">Projections</h2>
        <Line data={data}/>
        <table className="w-full mt-4">
          <thead>
            <tr>
              <th>Age</th>
              <th>Portfolio Value</th>
              <th>Withdrawal</th>
              <th>Taxes</th>
              <th>Portfolio Growth</th>
              <th>Remaining Balance</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((p, i) => (
              <tr key={i}>
                <td>{p.age}</td>
                <td>${p.portfolioValue.toLocaleString()}</td>
                <td>${p.withdrawal.toLocaleString()}</td>
                <td>${p.taxes.toLocaleString()}</td>
                <td>${p.portfolioGrowth.toLocaleString()}</td>
                <td>${p.remainingBalance.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RetirementPlanner;
