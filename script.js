const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

// FIX 1: Change 'transaction' (singular) to 'transactions' (plural) for consistency with saving later.
// FIX 2: Parse the JSON string retrieved from localStorage into a JavaScript array.
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = parseFloat(amountEl.value);

    // Optional: Add basic validation to prevent empty description or invalid amount
    if (description === '' || isNaN(amount)) {
        alert('Please enter a valid description and amount.');
        return;
    }

    // FIX 3: Use 'transactions' (plural) here to push to the correct array.
    transactions.push({
        id: Date.now(),
        description,
        amount
    });

    // FIX 4: Use 'transactions' (plural) consistently when saving to localStorage.
    // FIX 5: Stringify the array before saving it to localStorage.
    localStorage.setItem("transactions", JSON.stringify(transactions));

    updateTransactionList();
    updateSummary(); // This function will need to be defined to avoid a ReferenceError

    transactionFormEl.reset();
}

function updateTransactionList() {
    transactionListEl.innerHTML = "";

    // The 'transactions' array is already defined globally. No need to spread 'transactions' into a new variable called 'transactions'.
    // If you specifically want to reverse the order for display, you can do:
    const sortedTransactions = [...transactions].reverse(); // Creates a shallow copy before reversing

    sortedTransactions.forEach((transaction) => {
        // FIX 6: Correct the typo: 'ElcreateTransactionElement' should be 'createTransactionElement'.
        const transactionEl = createTransactionElement(transaction);
        transactionListEl.appendChild(transactionEl);
    });
}

function createTransactionElement(transaction) {
    const li = document.createElement("li");
    li.classList.add("transaction");
    li.classList.add(transaction.amount > 0 ? "income" : "expense");

    // FIX 7: Use backticks (`) for template literals, not single quotes (').
    // FIX 8: Added basic formatting for the amount, ensuring negative signs are handled and it's fixed to 2 decimal places.
    li.innerHTML = `
      <span>${transaction.description}</span>
      <span>${transaction.amount < 0 ? '-' : ''}$${Math.abs(transaction.amount).toFixed(2)}
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
      </span>
    `;
    // FIX 9: The function must return the created 'li' element.
    return li;
}

// FIX 10: Define the `removeTransaction` function as it's called from the button.
function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    updateTransactionList();
    updateSummary(); // Re-calculate summary after removing
}


// FIX 11: Define the `updateSummary` function as it's called in `addTransaction` and `removeTransaction`.
function updateSummary() {
    const totalIncome = transactions
        .filter(transaction => transaction.amount > 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpense = transactions
        .filter(transaction => transaction.amount < 0)
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const balance = totalIncome + totalExpense; // totalExpense is already negative or zero

    // Update the display elements
    balanceEl.textContent = `$${balance.toFixed(2)}`;
    incomeAmountEl.textContent = `$${totalIncome.toFixed(2)}`;
    // Display expense as a positive number for the 'expense-amount' element
    expenseAmountEl.textContent = `$${Math.abs(totalExpense).toFixed(2)}`;
}


// FIX 12: Call update functions on page load to display any existing transactions from localStorage.
document.addEventListener('DOMContentLoaded', () => {
    updateTransactionList();
    updateSummary();
});