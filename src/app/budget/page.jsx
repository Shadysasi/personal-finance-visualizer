"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BudgetForm from "@/components/BudgetForm";
import { Edit2, PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/data";
import { fetchBudgets } from "@/lib/fetchTransactions";
import BudgetCard from "@/components/BudgetCard";



const BudgetPage = () => {
  const [budgets, setBudgets] = useState([]);
  const [showForm, setShowForm] = useState(false)
  const categories = getCategories(); 
  const [loading, setLoading] = useState(true);

  // Fetch budgets when the component mounts
  useEffect(() => {
    fetchBudgets()
      .then((data) => {
        setBudgets(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching budgets:", error);
        setLoading(false);
      });
  }, []);

  // Function to handle budget creation or update
  const handleUpdateBudget = async (budgetData) => {
    const response = await fetch("/api/budget", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    });

    if (response.ok) {
      const updatedBudget = await response.json();
      setBudgets((prevBudgets) => {
        // Check if the category already exists in the state, update it if found
        const updatedBudgets = prevBudgets.map((budget) =>
          budget.category === updatedBudget.category ? updatedBudget : budget
        );

      
        if (
          !updatedBudgets.some(
            (budget) => budget.category === updatedBudget.category
          )
        ) {
          updatedBudgets.push(updatedBudget);
        }

        return updatedBudgets;
      });
      setShowForm(false);
    } else {
      console.error("Error updating budget:", response);
    }
  };

  // Function to determine budget status color based on spending percentage
  const getBudgetStatusColor = (spent, limit) => {
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return "bg-red-500"; 
    if (percentage >= 75) return "bg-yellow-500"; 
    return "bg-green-500"; 
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Budget Management</h1>
        <Button onClick={() => setShowForm(true)} className="flex items-center">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </div>

      <div className="grid gap-6">
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetForm
                categories={categories}
                onSubmit={handleUpdateBudget}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p>Loading budgets...</p>
          ) : (
            budgets.map((budget) => {
              const percentage = (budget.actualSpent / budget.limit) * 100;
              const statusColor = getBudgetStatusColor(
                budget.actualSpent,
                budget.limit
              );

              return (
                <div key={budget._id}>
                  <BudgetCard
                    budget={budget}
                    statusColor={statusColor}
                    percentage={percentage}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;