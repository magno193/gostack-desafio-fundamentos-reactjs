import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

interface ResponseData {
  transactions: Transaction[];
  balance: {
    income: number;
    outcome: number;
    total: number;
  };
}

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('transactions');
      const responseData: ResponseData = response.data;

      const transactionData = responseData.transactions;
      const formattedTransaction = transactionData.map(transaction => ({
        ...transaction,
        formattedValue: formatValue(transaction.value),
        formattedDate: new Date(transaction.created_at).toLocaleDateString(
          'pt-br',
        ),
      }));

      const balanceData = responseData.balance;
      const formattedBalance = {
        income: formatValue(balanceData.income),
        outcome: formatValue(balanceData.outcome),
        total: formatValue(balanceData.total),
      };

      setTransactions(formattedTransaction);
      setBalance(formattedBalance);
    }

    loadTransactions();
  }, []);
  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Entradas</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Saídas</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Preço</th>
                <th>Categoria</th>
                <th>Data</th>
              </tr>
            </thead>

            <tbody>
              {transactions &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    {transaction.type === 'income' ? (
                      <td className="income">{transaction.formattedValue}</td>
                    ) : (
                      <td className="outcome">{`- ${transaction.formattedValue}`}</td>
                    )}

                    {transaction.category ? (
                      <td>{transaction.category.title}</td>
                    ) : (
                      <td>null</td>
                    )}
                    <td>{transaction.formattedDate}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
