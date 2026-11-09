// ========================================
// BILLBUDDY SIGN UP
// ========================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password
        };

        localStorage.setItem("billBuddyUser", JSON.stringify(user));

        alert("Account created successfully! 🎉");

        window.location.href = "login.html";
    });
}


// ========================================
// BILLBUDDY LOGIN
// ========================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        const savedUser = JSON.parse(
            localStorage.getItem("billBuddyUser")
        );

        if (!savedUser) {
            alert("No account found. Please Sign Up first.");
            return;
        }

        if (
            email === savedUser.email &&
            password === savedUser.password
        ) {
            localStorage.setItem("billBuddyLoggedIn", "true");

            alert("Login successful! 🎉");

            window.location.href = "dashboard.html";
        } else {
            alert("Incorrect email or password.");
        }
    });
}


// ========================================
// DASHBOARD
// ========================================

if (window.location.pathname.includes("dashboard.html")) {

    const savedUser = JSON.parse(
        localStorage.getItem("billBuddyUser")
    );

    const loggedIn =
        localStorage.getItem("billBuddyLoggedIn");

    if (!savedUser || loggedIn !== "true") {

        window.location.href = "login.html";

    } else {

        const welcomeUser =
            document.getElementById("welcomeUser");

        if (welcomeUser) {
            welcomeUser.textContent =
                "Welcome back, " + savedUser.name + "! 👋";
        }

        displayExpenses();
        updateDashboard();
        displayBills();
        updateBillDashboard();
        updateReports();
    }
}


// ========================================
// ADD EXPENSE
// ========================================

function addExpense() {

    const name =
        document.getElementById("expenseName").value.trim();

    const amount =
        Number(
            document.getElementById("expenseAmount").value
        );

    const category =
        document.getElementById("expenseCategory").value;

    const date =
        document.getElementById("expenseDate").value;

    if (!name || !amount || !date) {
        alert("Please fill all expense details.");
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        amount: amount,
        category: category,
        date: date
    };

    let expenses =
        JSON.parse(
            localStorage.getItem("billBuddyExpenses")
        ) || [];

    expenses.push(expense);

    localStorage.setItem(
        "billBuddyExpenses",
        JSON.stringify(expenses)
    );

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseDate").value = "";

    displayExpenses();
    updateDashboard();
    updateReports();

    alert("Expense added successfully! 💰");
}


// ========================================
// DISPLAY EXPENSES
// ========================================

function displayExpenses() {

    const expenseList =
        document.getElementById("expenseList");

    if (!expenseList) return;

    const expenses =
        JSON.parse(
            localStorage.getItem("billBuddyExpenses")
        ) || [];

    if (expenses.length === 0) {

        expenseList.innerHTML = `
            <p class="empty-message">
                No expenses added yet.
            </p>
        `;

        return;
    }

    expenseList.innerHTML = "";

    expenses
        .slice()
        .reverse()
        .forEach(function (expense) {

            const item =
                document.createElement("div");

            item.className = "expense-item";

            item.innerHTML = `

                <div class="expense-info">

                    <strong>
                        ${expense.name}
                    </strong>

                    <small>
                        ${expense.category} • ${expense.date}
                    </small>

                </div>

                <div class="expense-right">

                    <span class="expense-amount">
                        ₹${Number(expense.amount).toLocaleString("en-IN")}
                    </span>

                    <button
                        class="delete-expense"
                        onclick="deleteExpense(${expense.id})"
                    >
                        Delete
                    </button>

                </div>
            `;

            expenseList.appendChild(item);
        });
}


// ========================================
// DELETE EXPENSE
// ========================================

function deleteExpense(id) {

    let expenses =
        JSON.parse(
            localStorage.getItem("billBuddyExpenses")
        ) || [];

    expenses =
        expenses.filter(function (expense) {
            return expense.id !== id;
        });

    localStorage.setItem(
        "billBuddyExpenses",
        JSON.stringify(expenses)
    );

    displayExpenses();
    updateDashboard();
    updateReports();
}


// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {

    const expenses =
        JSON.parse(
            localStorage.getItem("billBuddyExpenses")
        ) || [];

    const total =
        expenses.reduce(
            function (sum, expense) {
                return sum + Number(expense.amount);
            },
            0
        );

    const totalExpenses =
        document.getElementById("totalExpenses");

    const monthlyExpenses =
        document.getElementById("monthlyExpenses");

    if (totalExpenses) {
        totalExpenses.textContent =
            "₹" + total.toLocaleString("en-IN");
    }

    if (monthlyExpenses) {

        const currentMonth =
            new Date().getMonth();

        const currentYear =
            new Date().getFullYear();

        const monthlyTotal =
            expenses.reduce(
                function (sum, expense) {

                    const expenseDate =
                        new Date(expense.date);

                    if (
                        expenseDate.getMonth() === currentMonth &&
                        expenseDate.getFullYear() === currentYear
                    ) {
                        return sum + Number(expense.amount);
                    }

                    return sum;

                },
                0
            );

        monthlyExpenses.textContent =
            "₹" + monthlyTotal.toLocaleString("en-IN");
    }
}


// ========================================
// LOGOUT
// ========================================

function logout() {

    localStorage.removeItem("billBuddyLoggedIn");

    window.location.href = "login.html";
}


// ========================================
// BILL MANAGEMENT
// ========================================

function addBill() {

    const name =
        document.getElementById("billName").value.trim();

    const amount =
        Number(
            document.getElementById("billAmount").value
        );

    const dueDate =
        document.getElementById("billDueDate").value;

    const status =
        document.getElementById("billStatus").value;

    if (!name || !amount || !dueDate) {

        alert("Please fill all bill details.");

        return;
    }

    const bill = {

        id: Date.now(),

        name: name,

        amount: amount,

        dueDate: dueDate,

        status: status,
        reminderDays: Number(document.getElementById("reminderDays")?.value ?? 1)
    };

    let bills =
        JSON.parse(
            localStorage.getItem("billBuddyBills")
        ) || [];

    bills.push(bill);

    localStorage.setItem(
        "billBuddyBills",
        JSON.stringify(bills)
    );

    document.getElementById("billName").value = "";
    document.getElementById("billAmount").value = "";
    document.getElementById("billDueDate").value = "";

    displayBills();
    updateBillDashboard();

    alert("Bill added successfully! 🧾");
}


// ========================================
// DISPLAY BILLS
// ========================================

function displayBills() {

    const billList =
        document.getElementById("billList");

    if (!billList) return;

    const bills =
        JSON.parse(
            localStorage.getItem("billBuddyBills")
        ) || [];

    if (bills.length === 0) {

        billList.innerHTML = `
            <p class="empty-message">
                No bills added yet.
            </p>
        `;

        return;
    }

    billList.innerHTML = "";

    bills
        .slice()
        .reverse()
        .forEach(function (bill) {

            const item =
                document.createElement("div");

            item.className = "expense-item";

            item.innerHTML = `

                <div class="expense-info">

                    <strong>
                        ${bill.name}
                    </strong>

                    <small>
                        Due: ${bill.dueDate}
                    </small>

                </div>

                <div class="expense-right">

                    <span class="expense-amount">
                        ₹${Number(bill.amount).toLocaleString("en-IN")}
                    </span>

                    <span class="${bill.status === "Paid" ? "paid" : "pending"}">
                        ${bill.status}
                    </span>

                    <button
                        class="delete-expense"
                        onclick="deleteBill(${bill.id})"
                    >
                        Delete
                    </button>

                </div>
            `;

            billList.appendChild(item);
        });
}


// ========================================
// DELETE BILL
// ========================================

function deleteBill(id) {

    let bills =
        JSON.parse(
            localStorage.getItem("billBuddyBills")
        ) || [];

    bills =
        bills.filter(function (bill) {
            return bill.id !== id;
        });

    localStorage.setItem(
        "billBuddyBills",
        JSON.stringify(bills)
    );

    displayBills();
    updateBillDashboard();
}


// ========================================
// UPDATE BILL DASHBOARD
// ========================================

function updateBillDashboard() {

    const bills =
        JSON.parse(
            localStorage.getItem("billBuddyBills")
        ) || [];

    const totalBills =
        bills.reduce(
            function (sum, bill) {
                return sum + Number(bill.amount);
            },
            0
        );

    const pendingBills =
        bills
            .filter(function (bill) {
                return bill.status === "Pending";
            })
            .reduce(
                function (sum, bill) {
                    return sum + Number(bill.amount);
                },
                0
            );

    const totalBillsElement =
        document.getElementById("totalBills");

    const pendingBillsElement =
        document.getElementById("pendingBills");

    if (totalBillsElement) {
        totalBillsElement.textContent =
            "₹" + totalBills.toLocaleString("en-IN");
    }

    if (pendingBillsElement) {
        pendingBillsElement.textContent =
            "₹" + pendingBills.toLocaleString("en-IN");
    }
}


// ========================================
// REPORTS
// ========================================

// ========================================
// REPORTS
// ========================================

function updateReports() {

    const expenses =
        JSON.parse(localStorage.getItem("billBuddyExpenses")) || [];

    const monthSelect = document.getElementById("reportMonth");
    const yearSelect = document.getElementById("reportYear");

    if (!monthSelect || !yearSelect) return;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // Populate year selector
    if (yearSelect.options.length === 0) {
        for (
            let year = currentYear;
            year >= currentYear - 10;
            year--
        ) {
            const option = document.createElement("option");

            option.value = year;
            option.textContent = year;

            yearSelect.appendChild(option);
        }
    }

    // Default to current month and year
    if (!monthSelect.dataset.initialized) {

        monthSelect.value = currentMonth;
        yearSelect.value = currentYear;

        monthSelect.dataset.initialized = "true";
    }

    const selectedMonth = Number(monthSelect.value);
    const selectedYear = Number(yearSelect.value);

    const monthlyExpenses = expenses.filter(expense => {

        const date = new Date(expense.date + "T00:00:00");

        return date.getMonth() === selectedMonth &&
               date.getFullYear() === selectedYear;
    });

    const total = monthlyExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount),
        0
    );

    const reportTotal = document.getElementById("reportTotal");
    const reportMonthly = document.getElementById("reportMonthly");
    const categoryReport = document.getElementById("categoryReport");

    if (reportTotal) {
        reportTotal.textContent =
            "₹" + total.toLocaleString("en-IN");
    }

    if (reportMonthly) {
        reportMonthly.textContent =
            "₹" + total.toLocaleString("en-IN");
    }

    const heading = reportTotal
        ?.closest(".report-card")
        ?.querySelector("h3");

    if (heading) {
        heading.textContent =
            monthSelect.options[selectedMonth].text +
            " " + selectedYear + " Spending";
    }

    if (!categoryReport) return;

    if (monthlyExpenses.length === 0) {

        categoryReport.innerHTML =
            '<p class="empty-message">No expenses for this month. Add an expense to get started! 💗</p>';

        return;
    }

    const categories = {};

    monthlyExpenses.forEach(expense => {

        const category = expense.category || "Other";

        categories[category] =
            (categories[category] || 0) +
            Number(expense.amount);
    });

    categoryReport.innerHTML = "";

    Object.entries(categories).forEach(([category, amount]) => {

        const row = document.createElement("div");
        row.className = "expense-item";

        const name = document.createElement("strong");
        name.textContent = category;

        const value = document.createElement("span");
        value.className = "expense-amount";

        value.textContent =
            "₹" + amount.toLocaleString("en-IN");

        row.append(name, value);

        categoryReport.appendChild(row);
    });
}

// Update reports when the selected month or year changes
document.getElementById("reportMonth")
    ?.addEventListener("change", updateReports);

document.getElementById("reportYear")
    ?.addEventListener("change", updateReports);