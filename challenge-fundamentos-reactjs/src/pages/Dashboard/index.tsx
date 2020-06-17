import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

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

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const response = await api.get('/transactions');

      setTransactions([...response.data.transactions]);
      setBalance(response.data.balance);
    }

    loadTransactions();
  }, []);
  const formatDate = (date: Date): string => {
    const FormatedDate = JSON.stringify(date).split('-');
    const year = FormatedDate[0].slice(1);
    const month = FormatedDate[1];
    const day = FormatedDate[2].slice(0, 2);
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Header />
      <Container>
        {!!balance.income && (
          <CardContainer>
            <Card>
              <header>
                <p>Entradas</p>
                <img src={income} alt="Income" />
              </header>
              <h1 data-testid="balance-income">
                {formatValue(Number(balance.income))}
              </h1>
            </Card>
            <Card>
              <header>
                <p>Saídas</p>
                <img src={outcome} alt="Outcome" />
              </header>
              <h1 data-testid="balance-outcome">
                {formatValue(Number(balance.outcome))}
              </h1>
            </Card>
            <Card total>
              <header>
                <p>Total</p>
                <img src={total} alt="Total" />
              </header>
              <h1 data-testid="balance-total">
                {formatValue(Number(balance.total))}
              </h1>
            </Card>
          </CardContainer>
        )}

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>
                  Título
                  <FiChevronDown />
                </th>
                <th>
                  Preço
                  <FiChevronDown />
                </th>
                <th>
                  Categoria
                  <FiChevronDown />
                </th>
                <th>
                  Data
                  <FiChevronUp color="#FF872C" />
                </th>
              </tr>
            </thead>

            <tbody>
              {!!transactions.length &&
                transactions.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="title">{transaction.title}</td>
                    <td
                      className={
                        transaction.type === 'income' ? 'income' : 'outcome'
                      }
                    >
                      {transaction.type === 'income' ? '' : '- '}
                      {formatValue(transaction.value)}
                    </td>
                    <td>{transaction.category.title}</td>
                    <td>{formatDate(transaction.created_at)}</td>
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
