"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import TransactionList from "@/components/TransactionList";
import { useEffect, useState } from "react";
import { fetchBudgets, fetchTransactions } from "@/lib/fetchTransactions";

export default function DashboardPage() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);

  // Fetch budgets and transactions when the component mounts
  useEffect(() => {
    fetchBudgets()
      .then((data) => {
        setBudgets(data);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
      });

    fetchTransactions()
      .then((data) => {
        setTransactions(data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      });
  }, []);

  // Calculate total expenses from transactions
  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0);
  // Calculate total budget from all budget categories
  const totalBudget = budgets.reduce((sum, b) => sum + b.limit, 0);
  const [overBudgetCategories, setOverBudgetCategories] = useState([]);

  // Identify categories that exceed their budget limits
  useEffect(() => {
    setOverBudgetCategories(budgets.filter((b) => b.actualSpent > b.limit));
  }, [budgets]);

 

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Summary Cards Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Expenses Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalExpenses.toFixed(2)}
            </div>
          </CardContent>
        </Card>

        {/* Total Budget Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalBudget.toFixed(2)}</div>
          </CardContent>
        </Card>

        {/* Budget Status Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            {totalExpenses > totalBudget ? (
              <TrendingDown className="h-4 w-4 text-destructive" />
            ) : (
              <TrendingUp className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalExpenses > totalBudget ? "Over Budget" : "Under Budget"}
            </div>
          </CardContent>
        </Card>

        {/* Alerts Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overBudgetCategories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Categories over budget
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionList transactions={transactions.slice(0, 5)} compact />
        </CardContent>
      </Card>
    </div>
  );
}