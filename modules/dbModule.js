import User from "../models/user.js";
import Order from "../models/order.js";
import Period from "../models/period.js";

// Find User by User_ID
async function findUserByUserId(userId) {
  try {
    // Find the user by userId
    const user = await User.findOne({ $or: [{ userId: userId }] });

    if (!user) {
      throw new Error("User not found");
    }

    // Return the user object if found
    return user;
  } catch (error) {
    // Handle errors and return an error message or handle the error as needed
    console.error("Error finding user by userId:", error.message);
    throw error;
  }
}

// Find User by Mobile Number
async function findUserByNumber(number) {
  const user = await User.findOne({
    $or: [{ mobileNumber: number }],
  });

  return user;
}

// All databse get function

async function getUserBalance(userId) {
  try {
    // Find the user by userId
    const user = await findUserByUserId(userId);

    // Return the user's balance
    return user.balance;
  } catch (error) {
    // Handle errors and return an error message or handle the error as needed
    console.error("Error fetching user balance:", error.message);
    throw error;
  }
}

// All database update function

async function updateUserBalance(userId, amount) {
  try {
    // Find the user by userId
    const user = await findUserByUserId(userId);

    // Check if the amount is positive (deposit) or negative (deduction)
    user.balance += amount;

    // Save the updated user object to the database
    await user.save();

    console.log(user.balance);

    // Return the updated user balance
    return user.balance;
  } catch (error) {
    // Handle errors and return an error message or handle the error as needed
    console.error("Error updating user balance:", error.message);
    throw error;
  }
}

// Update user password
async function updateUserPassword(mobilenumber, newPassword) {
  try {
    const user = await findUserByNumber(mobilenumber);

    // Update the user's password
    user.password = newPassword;

    // Save the updated user object to the database
    await user.save();
  } catch (error) {
    // Handle errors and return an error message or handle the error as needed
    console.error("Error updating user balance:", error.message);
    throw error;
  }
}

// Add new user orders
async function addOrdersToUser(userId, orders) {
  try {
    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      console.error("User not found.");
      return;
    }

    // Add the orders to the user's "orders" array
    user.orders.push(...orders);

    // Save the updated user document
    await user.save();

    console.log("Orders added to user:", userId);
  } catch (error) {
    console.error("Error adding orders to user:", error);
  }
}

// Update user bets
async function updateUserBets(userId, additionalBets) {
  try {
    // Find the user by userId
    const user = await findUserByUserId(userId);

    // Update the user's totalBets by adding the additionalBets
    user.totalBets += additionalBets;

    // Save the updated user object to the database
    await user.save();
  } catch (error) {
    // Handle errors and return an error message or handle the error as needed
    console.error("Error updating total bets:", error.message);
    throw error;
  }
}

// add orders made by users
async function addOrdersToDatabase(orders) {
  try {
    // Insert the orders into the database
    const insertedOrders = await Order.create(orders);
    console.log("Orders added to the database:", insertedOrders);
  } catch (error) {
    console.error("Error adding orders to the database:", error);
  }
}

// Function to increment the count value of a specific period document by newCount
async function incrementCountById(periodId) {
  try {
    const updatedPeriod = await Period.findByIdAndUpdate(
      periodId,
      { $inc: { count: 1 } }, // Use the $inc operator to increment the count
      { new: true }
    );

    if (!updatedPeriod) {
      console.error("Period document not found.");
      return null;
    }

    console.log(`Count incremented by 1. Updated Period document:`);
  } catch (error) {
    console.error("Error incrementing count:", error);
    return null;
  }
}

// function to get Period by Id
async function getPeriodById(id) {
  try {
    const period = await Period.findById(id);

    if (!period) {
      console.error("Period document not found.");
      return null;
    }

    return period.count;
  } catch (error) {
    console.error("Error getting period document:", error);
    return null;
  }
}

// Function to create a new period document
async function createPeriodDocument(count) {
  try {
    // Create a new period document with the provided count value
    const period = new Period({
      count: count,
    });

    // Save the new period document to the database
    await period.save();
    console.log("Period document created successfully.");
  } catch (error) {
    console.error("Error creating period document:", error);
  }
}

export {
  findUserByNumber,
  findUserByUserId,
  updateUserBalance,
  updateUserPassword,
  addOrdersToUser,
  updateUserBets,
  addOrdersToDatabase,
  incrementCountById,
  getPeriodById,
  createPeriodDocument,
  getUserBalance,
};
