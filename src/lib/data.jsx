const categories = [
  "Food",
  "Housing",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Shopping",
  "Healthcare",
  "Education",
  "Other",
];

const payment_method = [
  { title: "Cash", value: "cash" },
  { title: "Credit Card", value: "credit" },
  { title: "Debit Card", value: "debit" },
  { title: "Bank Transfer", value: "transfer" },
];

export function getCategories() {
  return categories;
}
export function getPaymentMethod() {
  return payment_method;
}