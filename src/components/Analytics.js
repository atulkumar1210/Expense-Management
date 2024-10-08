import React from 'react';
import { Progress } from 'antd';
import './Analytics.css';

const Analytics = ({ allTransection }) => {
  const categories = ['salary', 'tip', 'project', 'food', 'movie', 'bills', 'medical', 'fee', 'tax', 'other'];
  const totalTransaction = allTransection.length;
  const totalIncomeTransaction = allTransection.filter((transaction) => transaction.type === "income");
  const totalExpenseTransaction = allTransection.filter((transaction) => transaction.type === "expense");
  const totalIncomePercent = (totalIncomeTransaction.length / totalTransaction) * 100;
  const totalExpensePercent = (totalExpenseTransaction.length / totalTransaction) * 100;

  const totalTurnover = allTransection.reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalIncomeTurnover = allTransection
    .filter((transaction) => transaction.type === "income")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalExpenseTurnover = allTransection
    .filter((transaction) => transaction.type === "expense")
    .reduce((acc, transaction) => acc + transaction.amount, 0);
  const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;
  const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

  return (
    <div className='analytics-container'>
      <div className='row'>
        <div className='col-md-4'>
          <div className='card custom-card'>
            <div className='card-header'>
              Total Transactions: {totalTransaction}
            </div>
            <div className='card-body'>
              <h5>Income: {totalIncomeTransaction.length}</h5>
              <h5>Expense: {totalExpenseTransaction.length}</h5>
              <div className='progress-container'>
                <Progress type='circle' strokeColor={'green'} className='progress-item' percent={totalIncomePercent.toFixed(2)} />
                <Progress type='circle' strokeColor={'red'} className='progress-item' percent={totalExpensePercent.toFixed(2)} />
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='card custom-card'>
            <div className='card-header'>
              Total Turnover: {totalTurnover}
            </div>
            <div className='card-body'>
              <h5>Income: {totalIncomeTurnover}</h5>
              <h5>Expense: {totalExpenseTurnover}</h5>
              <div className='progress-container'>
                <Progress type='circle' strokeColor={'green'} className='progress-item' percent={totalIncomeTurnoverPercent.toFixed(2)} />
                <Progress type='circle' strokeColor={'red'} className='progress-item' percent={totalExpenseTurnoverPercent.toFixed(2)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='clas'>
      <h4>Categories Income</h4>
        <div className='col'>
          {/* <h4>Categories Income</h4> */}
          {categories.map(category => {
            const amount = allTransection.filter(transaction => transaction.type === 'income' && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className='card custom-card'>
                  <div className='card-body'>
                    <h5>{category}</h5>
                    <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(2)} />
                  </div>
                </div>
              )
            );
          })}
        </div>
        <h4>Categories Expense</h4>
        <div className='col'>
          {/* <h4>Categories Expense</h4> */}
          {categories.map(category => {
            const amount = allTransection.filter(transaction => transaction.type === 'expense' && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
            return (
              amount > 0 && (
                <div className='card custom-card'>
                  <div className='card-body'>
                    <h5>{category}</h5>
                    <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(2)} />
                  </div>
                </div>
              )
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Analytics;


