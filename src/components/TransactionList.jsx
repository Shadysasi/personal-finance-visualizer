"use client";

import { useState } from "react";
import { Trash2, Edit2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getCategories } from "@/lib/data";

export default function TransactionList({
  transactions,
  onDelete,
  onUpdate,
  compact = false,
}) {
  // States for handling editing and deletion processes
  const [editingId, setEditingId] = useState(null);
  const [editedTransaction, setEditedTransaction] = useState(null); 
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [previousAmount, setPreviousAmount] = useState(null);

  const categories = getCategories(); // Fetch the available categories

  // Reload the page after editing or deleting a transaction
  const ReloadPage = () => {
    if (typeof window !== "undefined") {
      window.location.reload(); 
    }
  };

  // Handle the click on the edit button, opening the edit form for the specific transaction
  const handleEditClick = (transaction) => {
    setEditingId(transaction._id); 
    setEditedTransaction({ ...transaction }); 
  };

  // Cancel the editing process and reset the form
  const handleCancelEdit = () => {
    setEditingId(null); 
    setEditedTransaction(null); 
  };

  // Save the edited transaction to the database
  const handleSaveEdit = async () => {
    if (editedTransaction) {
      const { _id, category, amount, date, description, paymentMethod } =
        editedTransaction;

      // Make an API call to update the transaction details in the database
      const response = await fetch(`/api/transactions`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          _id,
          category,
          amount,
          previousAmount,
          date,
          description,
          paymentMethod,
        }),
      });

      // Handle success or failure
      if (response.ok) {
        alert("Transaction edited successfully");
        setEditingId(null); 
        ReloadPage(); 
      } else {
        alert("Error editing transaction");
      }
    }
  };

  // Trigger the delete confirmation dialog when the delete button is clicked
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction); 
    setShowConfirmDialog(true); 
  };

  // Confirm the deletion and call the onDelete function
  const handleConfirmDelete = () => {
    if (transactionToDelete) {
      onDelete(transactionToDelete._id); 
    }
    setShowConfirmDialog(false); 
    setTransactionToDelete(null); 
  };

  // Confirm the deletion from the dialog and delete the transaction
  const handleDeleteConfirm = async () => {
    if (transactionToDelete) {
      const { _id, category, amount } = transactionToDelete;

      // Make an API call to delete the transaction from the database
      const response = await fetch(`/api/transactions`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id, category, amount }),
      });

      // Handle success or failure
      if (response.ok) {
        alert("Transaction deleted successfully");
        setShowConfirmDialog(false); 
        ReloadPage(); 
      } else {
        alert("Error deleting transaction");
      }
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            {!compact && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction._id}>
              {editingId === transaction._id ? (
                // Edit form for the selected transaction
                <>
                  <TableCell>
                    <Input
                      type="date"
                      value={editedTransaction.date}
                      onChange={(e) =>
                        setEditedTransaction({
                          ...editedTransaction,
                          date: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editedTransaction.description}
                      onChange={(e) =>
                        setEditedTransaction({
                          ...editedTransaction,
                          description: e.target.value,
                        })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editedTransaction.category}
                      onValueChange={(value) =>
                        setEditedTransaction({
                          ...editedTransaction,
                          category: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={editedTransaction.paymentMethod}
                      onValueChange={(value) =>
                        setEditedTransaction({
                          ...editedTransaction,
                          paymentMethod: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="credit">Credit Card</SelectItem>
                        <SelectItem value="debit">Debit Card</SelectItem>
                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editedTransaction.amount}
                      onChange={(e) =>
                        setEditedTransaction({
                          ...editedTransaction,
                          amount: parseFloat(e.target.value),
                        })
                      }
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEdit}
                        className="h-8 w-8"
                      >
                        <Check className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCancelEdit}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                // Display transaction details and actions
                <>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{transaction.paymentMethod || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    ${transaction.amount.toFixed(2)}
                  </TableCell>
                  {!compact && (
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            handleEditClick(transaction);
                            setPreviousAmount(transaction.amount);
                          }}
                          className="h-8 w-8"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(transaction)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action
              cannot be undone.
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
}