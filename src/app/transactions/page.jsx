"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";

export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Fetch transactions from the database
  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/transactions");
      const data = await res.json();
      setTransactions(data);
    }
    fetchTransactions();
  }, []);

  // Add new transaction to MongoDB
  const handleAddTransaction = async (transaction) => {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transaction),
    });
    if (res.ok) {
      const newTransaction = await res.json();
      setTransactions([newTransaction, ...transactions]);
    }
    setShowForm(false);
  };

  // Edit transaction in MongoDB
  const handleEditTransaction = async (updatedTransaction) => {
    const res = await fetch(`/api/transactions/${updatedTransaction._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTransaction),
    });
    if (res.ok) {
      const updatedData = await res.json();
      setTransactions(
        transactions.map((transaction) =>
          transaction._id === updatedData._id ? updatedData : transaction
        )
      );
      setEditingTransaction(null);
    }
  };

  // Delete transaction from MongoDB
  const handleDeleteTransaction = async (transactionId, amount, category) => {
    const res = await fetch(`/api/transactions/${transactionId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      // Subtract the amount from the respective budget category
      await fetch(`/api/budget/update/${category}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, action: "subtract" }),
      });

      setTransactions(
        transactions.filter((transaction) => transaction._id !== transactionId)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transactions</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTransaction ? "Edit Transaction" : "New Transaction"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm
              onSubmit={
                editingTransaction
                  ? handleEditTransaction
                  : handleAddTransaction
              }
              transaction={editingTransaction}
              onCancel={() => setShowForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <TransactionList
        transactions={transactions}
        onEdit={setEditingTransaction}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}