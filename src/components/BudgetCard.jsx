"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Edit2, Trash2, X, Check } from "lucide-react";
import { Progress } from "./ui/progress";

// Alert Dialog for confirmation prompts
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "./ui/input";

// Custom Select Dropdown
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const BudgetCard = ({ budget, statusColor, percentage }) => {
  
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState(null);
  const [budgetToEdit, setBudgetToEdit] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  
  const [budgetInComponent, setBudgetInComponent] = useState(budget);

  // Handle delete button click
  const handleDeleteClick = (budget) => {
    setBudgetToDelete(budget);
    setShowConfirmDialog(true);
  };

  // Handle edit button click
  const handleEditClick = (budget) => {
    setBudgetToEdit(budget);
    setIsEditing(true);
  };

  // Confirm budget update and send request to the server
  const handleConfirmEditBudget = async () => {
    setBudgetInComponent(budgetToEdit);

    if (budgetToEdit) {
      const res = await fetch("/api/budget", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetToEdit),
      });

      if (!res.ok) {
        console.error("Failed to update budget");
        setBudgetToEdit(null);
        setIsEditing(false);
        throw new Error("Failed to update budget");
      } else {
        alert("Budget updated successfully");
        setBudgetToEdit(null);
        setIsEditing(false);
        return res.json();
      }
    }
  };

  const reloadPage = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Cancel the edit mode
  const handleCancelEditBudget = () => {
    setBudgetToEdit(null);
    setIsEditing(false);
  };

  // Confirm and delete the selected budget item
  const handleDeleteConfirm = async () => {
    if (budgetToDelete) {
      const res = await fetch("/api/budget", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetToDelete),
      });

      if (!res.ok) {
        console.error("Failed to delete budget");
        setBudgetToDelete(null);
        setShowConfirmDialog(false);
        throw new Error("Failed to delete budget");
      } else {
        alert("Budget Deleted successfully");
        setBudgetToDelete(null);
        setShowConfirmDialog(false);
        reloadPage();
        return res.json();
      }
    }
  };

  // Editing Mode UI
  if (isEditing) {
    return (
      <Card key={budgetToEdit._id} className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${statusColor}`} />
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex text-2xl items-center">
              <span className="mr-2">{budgetInComponent.category}</span>
              <Select
                value={budgetToEdit.period}
                onValueChange={(value) =>
                  setBudgetToEdit({ ...budgetToEdit, period: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleConfirmEditBudget(budgetToEdit)}
                className="h-8 w-8"
              >
                <Check className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleCancelEditBudget(budgetToEdit)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-2xl font-bold">
            <span>${budgetToEdit.actualSpent.toFixed(2)}</span>

            <div className="flex items-center gap-2">
              <span>$</span>
              <Input
                value={budgetToEdit.limit}
                onChange={(e) =>
                  setBudgetToEdit({
                    ...budgetToEdit,
                    limit: e.target.value,
                  })
                }
                className="font-bold w-[220px] text-2xl"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Progress
              value={percentage}
              className={percentage > 100 ? "bg-red-200" : ""}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{percentage.toFixed(1)}% spent</span>
              <span>
                ${(budgetToEdit.limit - budgetToEdit.actualSpent).toFixed(2)}{" "}
                remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Display the budget card when not in edit mode */}
      <Card key={budgetInComponent._id} className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-1 h-full ${statusColor}`} />
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>
              <span className="mr-2">{budgetInComponent.category}</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({budgetInComponent.period})
              </span>
            </div>
            <div className="flex space-x-2 items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditClick(budgetInComponent)}
                className="h-8 w-8"
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteClick(budgetInComponent)}
                className="h-8 w-8"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-2xl font-bold">
            <span>${budgetInComponent.actualSpent.toFixed(2)}</span>
            <span className="text-muted-foreground">
              ${budgetInComponent.limit.toFixed(2)}
            </span>
          </div>
          <div className="space-y-2">
            <Progress
              value={percentage}
              className={percentage > 100 ? "bg-red-200" : ""}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{percentage.toFixed(1)}% spent</span>
              <span>
                $
                {(
                  budgetInComponent.limit - budgetInComponent.actualSpent
                ).toFixed(2)}{" "}
                remaining
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation dialog for deletion */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {budgetToDelete?.category} budget?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BudgetCard;