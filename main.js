// my elements
let addBtn = document.getElementById('addBtn');
let amount = document.getElementById('amount');
let description = document.getElementById('description');
let type = document.getElementById('selection');
let expensesList = document.getElementById('expensesList');
let incomeList = document.getElementById('incomeList');
let totalExpenses = document.getElementById('totalExpenses');
let totalIncome = document.getElementById('totalIncome');
let totalNet = document.getElementById('totalNet');
let printBtn = document.getElementById('printBtn');
let deleteAllBtn = document.getElementById('deleteAllBtn');

class ProjectManagement {
  constructor() {
    this.data = JSON.parse(localStorage.getItem('ProjectManagement')) || {};
    this.expenses = this.data.expenses || [];
    this.income = this.data.income || [];
    this.mode = 'add';
    this.editIndex = null;
    this.editType = null;
  }

  saveData() {
    localStorage.setItem('ProjectManagement', JSON.stringify(this));
  }

  getExpenses(numbar, des) {
    this.expenses.push({ expen: numbar, description: des });
    this.saveData();
  }

  getIncome(numbar, des) {
    this.income.push({ incom: numbar, description: des });
    this.saveData();
  }

  getTotalExpenses() {
    this.TotalExpenses = this.expenses.reduce((acc, e) => acc + e.expen, 0);
  }

  getTotalIncome() {
    this.TotalIncome = this.income.reduce((acc, e) => acc + e.incom, 0);
  }

  getTotalAll() {
    this.TotalAll = this.TotalIncome - this.TotalExpenses;
    totalNet.innerHTML = this.TotalAll;
    this.saveData();
  }

  showExpenses() {
    expensesList.innerHTML = '';
    for (let i = 0; i < this.expenses.length; i++) {
      let li = document.createElement('li');
      li.className = 'flex justify-between items-center';
      li.innerHTML = ` <div >${i + 1}- (<span class="text-gray-700">${
        this.expenses[i].description
      }</span>) - <span class="text-red-500">${
        this.expenses[i].expen
      } جنية</span></div>
      <div>
        <button class="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-1 rounded-full"
          onclick="Management.editExpense(${i})">تعديل</button>
        <button class="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded-full"
          onclick="Management.deleteExpense(${i})">حذف</button>
      </div>`;
      expensesList.appendChild(li);
    }
    totalExpenses.innerHTML = this.TotalExpenses + 'جنية';
  }

  showIncome() {
    incomeList.innerHTML = '';
    for (let i = 0; i < this.income.length; i++) {
      let li = document.createElement('li');
      li.className = 'flex justify-between items-center';
      li.innerHTML = `<div>${i + 1}- (<span class="text-gray-700">${
        this.income[i].description
      }</span>) -- <span class="text-red-500">${
        this.income[i].incom
      } جنية</span></div>
      <div>
        <button class="bg-green-500 hover:bg-green-600 text-white font-medium px-4 py-1 rounded-full"
          onclick="Management.editIncome(${i})">تعديل</button>
        <button class="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-1 rounded-full"
          onclick="Management.deleteIncome(${i})">حذف</button>
      </div>`;
      incomeList.appendChild(li);
    }
    totalIncome.innerHTML = this.TotalIncome + ' جنية';
  }

  showData() {
    this.getTotalExpenses();
    this.getTotalIncome();
    this.getTotalAll();
    this.showExpenses();
    this.showIncome();
  }

  deleteExpense(index) {
    this.expenses.splice(index, 1);
    this.saveData();
    this.showData();
  }

  deleteIncome(index) {
    this.income.splice(index, 1);
    this.saveData();
    this.showData();
  }

  add() {
    let amountValue = parseFloat(amount.value);
    let descriptionValue = description.value.trim();

    if (isNaN(amountValue) || descriptionValue === '') {
      amount.placeholder = 'يرجي ادخال مبلغ';
      description.placeholder = 'يرجي ادخال وصف';
      return;
    }

    if (this.mode === 'add') {
      if (type.value === 'expense')
        this.getExpenses(amountValue, descriptionValue);
      else if (type.value === 'income')
        this.getIncome(amountValue, descriptionValue);
    } else if (this.mode === 'editExpense') {
      this.expenses[this.editIndex] = {
        expen: amountValue,
        description: descriptionValue,
      };
      addBtn.innerText = 'اضافة';
      this.mode = 'add';
    } else if (this.mode === 'editIncome') {
      this.income[this.editIndex] = {
        incom: amountValue,
        description: descriptionValue,
      };
      addBtn.innerText = 'اضافة';
      this.mode = 'add';
    }

    this.saveData();
    this.showData();

    amount.value = '';
    description.value = '';
    type.focus();
  }

  editExpense(index) {
    this.mode = 'editExpense';
    this.editIndex = index;
    amount.value = this.expenses[index].expen;
    description.value = this.expenses[index].description;
    addBtn.innerText = 'تحديث المصروف';
  }

  editIncome(index) {
    this.mode = 'editIncome';
    this.editIndex = index;
    amount.value = this.income[index].incom;
    description.value = this.income[index].description;
    addBtn.innerText = 'تحديث الدخل';
  }
  deleteAll() {
    this.expenses = [];
    this.income = [];
    this.saveData();
    this.showData();
  }
 printDatashow() {
  let printContent = document.getElementById('myapp').innerHTML;
  let netIncomeIn = document.getElementById('netIncomeIn').innerHTML;
  let newWindow = window.open('', '', 'width=800,height=700');
  newWindow.document.write(`
    <html>
      <head>
      <link rel="icon" type="image/svg+xml" href="logo/Account-rafiki.svg">
        <title>طباعة التقرير</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body class="p-6">
        ${printContent + netIncomeIn}
      </body>
    </html>
  `);
  newWindow.document.close();
  newWindow.print();
}

}

let Management = new ProjectManagement();
Management.showData();

addBtn.addEventListener('click', () => Management.add());
deleteAllBtn.addEventListener('click', () => Management.deleteAll());
printBtn.addEventListener('click', () => Management.printDatashow());

window.onload = () => type.focus();

console.log(Management);
