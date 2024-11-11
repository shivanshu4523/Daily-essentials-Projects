document.addEventListener("DOMContentLoaded", () => {
  const expenseForm = document.getElementById("expense-form");
  const expenseTableBody = document.getElementById("expense-list");
  const totalBalanceSpan = document.getElementById("total-balance");
  const slider = document.getElementById("slider");
  const creditBox = document.getElementById("credit-box");
  const debitBox = document.getElementById("debit-box");
  const categoryButtons = document.querySelectorAll(".category-btn");
  const categoryInput = document.getElementById("category");
  const descriptionInput = document.getElementById("description");
  const amountInput = document.getElementById("amount");

  const editModal = document.getElementById("edit-modal");
  const closeEditModalButton = document.querySelector("#edit-modal .close-btn");
  const editForm = document.getElementById("edit-form");
  const editDescriptionInput = document.getElementById("edit-description");
  const editAmountInput = document.getElementById("edit-amount");
  const editCategorySelect = document.getElementById("edit-category");
  const editTypeSelect = document.getElementById("edit-type");

  const categoryColors = {
    Food: "#48d225",
    Transportation: "#ff6f61",
    Entertainment: "#ffeb3b",
    "Daily Needs": "#ffeb3b",
    Others: "#f44336",
  };

  const modal = document.getElementById("confirm-modal");
  const closeModalButton = document.querySelector("#confirm-modal .close-btn");
  const confirmDeleteButton = document.getElementById("confirm-delete");
  const cancelDeleteButton = document.getElementById("cancel-delete");

  let rowToDelete;
  let rowToEdit;

  const loadData = () => {
    const storedData = JSON.parse(localStorage.getItem("expenses")) || [];
    const storedBalance = parseFloat(localStorage.getItem("totalBalance")) || 0;

    totalBalanceSpan.textContent = `${storedBalance.toFixed(2)}`;
    storedData.forEach((transaction) => {
      const tr = document.createElement("tr");
      const backgroundColor =
        transaction.type === "credit" ? "#d4edda" : "#f8d7da";
      const categoryColor = categoryColors[transaction.category] || "#000000";

      tr.style.backgroundColor = backgroundColor;
      tr.innerHTML = `
                <td>${transaction.description}</td>
                <td>₹${transaction.amount.toFixed(2)}</td>
                <td>${transaction.type}</td>
                <td style="color: ${categoryColor};">${
        transaction.category
      }</td> 
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

      expenseTableBody.appendChild(tr);

      tr.querySelector(".delete").addEventListener("click", function () {
        rowToDelete = tr;
        modal.style.display = "block";
      });

      tr.querySelector(".edit").addEventListener("click", function () {
        rowToEdit = tr;
        showEditModal(tr);
      });
    });
  };

  function showEditModal(row) {
    const cells = row.querySelectorAll("td");
    editDescriptionInput.value = cells[0].textContent;
    editAmountInput.value = cells[1].textContent.replace("₹", "");
    editCategorySelect.value = cells[3].textContent;
    editTypeSelect.value = cells[2].textContent;
    editModal.style.display = "block";
  }

  const saveData = () => {
    const transactions = [];
    expenseTableBody.querySelectorAll("tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      transactions.push({
        description: cells[0].textContent,
        amount: parseFloat(cells[1].textContent.replace("₹", "")),
        type: cells[2].textContent,
        category: cells[3].textContent,
      });
    });
    localStorage.setItem("expenses", JSON.stringify(transactions));
    localStorage.setItem(
      "totalBalance",
      totalBalanceSpan.textContent.replace("₹", "")
    );
  };

  categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      categoryButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      categoryInput.value = button.getAttribute("data-category");
    });
  });

  expenseForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!categoryInput.value) {
      alert("Please select a category.");
    } else {
      if (rowToEdit) {
        updateTransaction(rowToEdit);
      } else {
        addTransaction();
      }
    }
  });

  let totalBalance = parseFloat(localStorage.getItem("totalBalance")) || 0;
  let transactionType = "credit";

  creditBox.addEventListener("click", () => {
    if (transactionType !== "credit") {
      transactionType = "credit";
      slider.style.transform = "translateX(0)";
      slider.style.backgroundColor = "#5cb85c";
      creditBox.style.color = "white";
      debitBox.style.color = "black";
    }
  });

  debitBox.addEventListener("click", () => {
    if (transactionType !== "debit") {
      transactionType = "debit";
      slider.style.transform = "translateX(100%)";
      slider.style.backgroundColor = "#d9534f";
      creditBox.style.color = "black";
      debitBox.style.color = "white";
    }
  });

  function updateBalance(amount, type, oldType) {
    if (oldType === "credit") {
      totalBalance -= amount;
    } else if (oldType === "debit") {
      totalBalance += amount;
    }

    if (type === "credit") {
      totalBalance += amount;
    } else if (type === "debit") {
      totalBalance -= amount;
    }

    totalBalanceSpan.textContent = `${totalBalance.toFixed(2)}`;
    saveData();
  }

  function addTransaction() {
    const category = categoryInput.value;
    const description = descriptionInput.value;
    const amount = parseFloat(amountInput.value);

    if (description && !isNaN(amount) && amount > 0 && category) {
      const tr = document.createElement("tr");
      const backgroundColor =
        transactionType === "credit" ? "#d4edda" : "#f8d7da";
      const categoryColor = categoryColors[category] || "#000000";

      tr.style.backgroundColor = backgroundColor;
      tr.innerHTML = `
                <td>${description}</td>
                <td>₹${amount.toFixed(2)}</td>
                <td>${transactionType}</td>
                <td style="color: ${categoryColor};">${category}</td> 
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            `;

      expenseTableBody.appendChild(tr);

      updateBalance(amount, transactionType, null);

      descriptionInput.value = "";
      amountInput.value = "";
      categoryInput.value = "";
      categoryButtons.forEach((btn) => btn.classList.remove("active"));

      tr.querySelector(".delete").addEventListener("click", function () {
        rowToDelete = tr;
        modal.style.display = "block";
      });

      tr.querySelector(".edit").addEventListener("click", function () {
        rowToEdit = tr;
        showEditModal(tr);
      });

      saveData();
    } else {
      alert("Please enter a valid description, amount, and category.");
    }
  }

  function updateTransaction(row) {
    const description = editDescriptionInput.value;
    const amount = parseFloat(editAmountInput.value);
    const category = editCategorySelect.value;
    const type = editTypeSelect.value;

    if (description && !isNaN(amount) && amount > 0 && category) {
      const cells = row.querySelectorAll("td");
      const oldAmount = parseFloat(cells[1].textContent.replace("₹", ""));
      const oldType = cells[2].textContent;
      const categoryColor = categoryColors[category] || "#000000";

      cells[0].textContent = description;
      cells[1].textContent = `₹${amount.toFixed(2)}`;
      cells[2].textContent = type;
      cells[3].textContent = category;
      cells[3].style.color = categoryColor;
      row.style.backgroundColor = type === "credit" ? "#d4edda" : "#f8d7da";

      updateBalance(amount, type, oldType);

      rowToEdit = null;
      editModal.style.display = "none";
    } else {
      alert("Please enter a valid description, amount, and category.");
    }
  }

  closeEditModalButton.addEventListener("click", () => {
    editModal.style.display = "none";
  });

  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (rowToEdit) {
      updateTransaction(rowToEdit);
    }
  });

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  cancelDeleteButton.addEventListener("click", () => {
    modal.style.display = "none";
  });

  confirmDeleteButton.addEventListener("click", () => {
    if (rowToDelete) {
      const amount = parseFloat(
        rowToDelete
          .querySelector("td:nth-child(2)")
          .textContent.replace("₹", "")
      );
      const type = rowToDelete.querySelector("td:nth-child(3)").textContent;

      expenseTableBody.removeChild(rowToDelete);

      if (type === "credit") {
        totalBalance -= amount;
      } else if (type === "debit") {
        totalBalance += amount;
      }

      if (expenseTableBody.children.length === 0) {
        totalBalance = 0;
      }

      totalBalanceSpan.textContent = `₹${totalBalance.toFixed(2)}`;

      rowToDelete = null;
      saveData();
    }
    modal.style.display = "none";
  });

  loadData();
});
