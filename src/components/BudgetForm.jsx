"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const BudgetForm = ({ categories, onSubmit }) => {
  
  const [budget, setBudget] = useState({
    category: "",
    limit: "", 
    period: "monthly", 
    notes: "",
  });

  // Handles form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (budget.category && budget.limit) {
      onSubmit({
        ...budget,
        limit: parseFloat(budget.limit),
      });
    
      setBudget({
        category: "",
        limit: "",
        period: "monthly",
        notes: "",
      });
      toast.success("Budget updated successfully");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Selection Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Category</label>
          <Select
            required
            value={budget.category}
            onValueChange={(value) => setBudget({ ...budget, category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Period Selection (Monthly/Yearly) */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Period</label>
          <Select
            value={budget.period}
            onValueChange={(value) => setBudget({ ...budget, period: value })}
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
      </div>

      {/* Budget Limit Input Field */}
      <div className="space-y-2">
        <label htmlFor="limit" className="text-sm font-medium">
          Budget Limit ($)
        </label>
        <Input
          id="limit"
          type="number"
          step="0.01"
          required
          value={budget.limit}
          onChange={(e) => setBudget({ ...budget, limit: e.target.value })}
          placeholder="Enter budget amount"
        />
      </div>

      {/* Notes Input Field (Optional) */}
      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium">
          Notes (Optional)
        </label>
        <Textarea
          id="notes"
          value={budget.notes}
          onChange={(e) => setBudget({ ...budget, notes: e.target.value })}
          placeholder="Add any notes or reminders about this budget"
          className="h-24"
        />
      </div>

      {/* Submit Button */}
      <Button type="submit" className="w-full">
        Set Budget
      </Button>
    </form>
  );
};

export default BudgetForm;