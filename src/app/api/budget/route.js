import { dbConnect } from "@/lib/dbConnect";
import Budget from "@/models/Budget"; 

// Fetch all budgets
export const GET = async () => {
  try {
    await dbConnect(); // Establish database connection
    const budgets = await Budget.find(); // Get all budgets from the DB
    return new Response(JSON.stringify(budgets), { status: 200 });
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return new Response("Error fetching budgets", { status: 500 });
  }
};

// Store or update a budget
export const POST = async (req) => {
  const { category, limit, actualSpent, period, notes } = await req.json();

  // Validate required fields
  if (!category || !limit) {
    return new Response("Category and limit are required.", { status: 400 });
  }

  try {
    await dbConnect(); // Ensure database is connected

    // Use findOneAndUpdate with upsert option to update or create the document
    const updatedBudget = await Budget.findOneAndUpdate(
      { category }, 
      {
        category,
        limit,
        actualSpent,
        period,
        notes,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return new Response(JSON.stringify(updatedBudget), { status: 200 });
  } catch (error) {
    console.error("Error saving budget:", error);
    return new Response("Error saving budget", { status: 500 });
  }
};

// Update an existing budget
export const PUT = async (req) => {
  await dbConnect(); 

  try {
    const body = await req.json()
    const { category, period, limit } = body

    // Validate required fields
    if (!category || !period || !limit) {
      return new Response(
        { message: "Category, limit and period are required." },
        { status: 400 }
      );
    }

    // Update budget with matching category
    const updatedBudget = await Budget.findOneAndUpdate(
      { category },
      { period, limit }
    );

    return new Response(
      { message: "Budget updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating budget:", error);
    return new Response("Error updating budget", { status: 500 });
  }
};

// Delete a budget
export const DELETE = async (req) => {
  await dbConnect()

  try {
    const body = await req.json()
    const { category, limit } = body;

    // Validate required fields
    if (!category || !limit) {
      return new Response(
        { message: "Category and limit are required." },
        { status: 400 }
      );
    }

    // Find the budget entry to delete
    const deletedBudget = await Budget.findOne({ category });
    await Budget.deleteOne({ category })

    return new Response(
      { message: "Budget deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting budget:", error);
    return new Response("Error deleting budget", { status: 500 });
  }
};