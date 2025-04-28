// Fetch all transactions from the API
export async function fetchTransactions() {
  try {
    const response = await fetch("/api/transactions")
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching transactions:", error)
    return []
  }
}

// Calculate the total expenses for each month
export async function getMonthlyExpenses() {
  const transactionsArray = await fetchTransactions(); 
  const monthlyData = Array(12).fill(0)

  if (transactionsArray.length > 0) {
        transactionsArray.forEach((t) => {
      const month = new Date(t.date).getMonth()
      monthlyData[month] += t.amount
    });
  }

  return monthlyData; // Return the aggregated monthly data
}

// Calculate total expenses for each category
export async function getCategoryExpenses() {
  const transactionsArray = await fetchTransactions()
  const categoryData = {}; 

  // Loop through all transactions and aggregate expenses by category
  transactionsArray.forEach((t) => {
    categoryData[t.category] = (categoryData[t.category] || 0) + t.amount;
  });

  // Convert the category data into an array of {name, value} objects
  return Object.entries(categoryData).map(([name, value]) => ({ name, value }));
}

// Fetch the budget data from the API
export const fetchBudgets = async () => {
  const res = await fetch("/api/budget")
  if (!res.ok) throw new Error("Failed to fetch budgets")
  return res.json()
};