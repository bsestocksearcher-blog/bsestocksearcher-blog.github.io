'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
if(JSON.parse(localStorage.getItem('accounts')) == null){
localStorage.setItem(
  'accounts',
  JSON.stringify([account1, account2, account3, account4])
);
}
let accounts = JSON.parse(localStorage.getItem('accounts'));
console.log(accounts);

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');
const containerSignup = document.querySelector('.signup');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnOk = document.querySelector('.alert__btn');
const btnSignup = document.querySelector('.button--signup');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputSignupUsername = document.querySelector('.input__signup--usename');
const inputSignupPin = document.querySelector('.input__signup--pin');
const inputSignupInterest = document.querySelector('.input__signup--interest');
const inputSignupBalance = document.querySelector('.input__signup--balance');

const errorDiv = document.querySelector('.alert');
const errorMessage = document.querySelector('#alert-p');

containerApp.style.display = 'none';
inputLoginPin.focus();
const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date"></div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  if (acc.balance > 0) {
    acc.balance =
      acc.balance + acc.movements.reduce((acc, mov) => acc + mov, 0);
  } else {
    acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  }
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (cAcc) {
  const incomes = cAcc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = cAcc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = cAcc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * cAcc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const clearInputFields = function (fields) {
  let i;
  for (i = 0; i < fields.length; i++) {
    fields[i].value = '';
    fields[i].blur();
  }
};

const makeRandomUsername = function (length) {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvwxyz';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

const updateDATA = function () {
  if (typeof Storage !== 'undefined') {
    //Store it in accounts
    localStorage.setItem('accounts', JSON.stringify(accounts));
  } else {
    console.log('We cant store your data sorry');
    alert('We cant store your data sorry');
  }
};

const showErrorMessage = function (mssg) {
  errorMessage.textContent = mssg;
  errorDiv.classList.remove('alert-success');
  errorDiv.classList.add('alert-danger');
  errorDiv.classList.remove('visible');
};
const showSuccessMessage = function (mssg) {
  errorMessage.textContent = mssg;
  errorDiv.classList.remove('alert-danger');
  errorDiv.classList.add('alert-success');
  errorDiv.classList.remove('visible');
};

// Event handlers
let currentAccount = {};

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.display = 'grid';
    containerSignup.style.display = 'none';
    //clear input fields
    clearInputFields([inputLoginUsername, inputLoginPin]);
    updateUI(currentAccount);
    showSuccessMessage(`successfully logged in as ${currentAccount.owner}`);
    updateDATA();
  } else if (!inputLoginUsername.value) {
    showErrorMessage('You left the username field blank');
  } else if (!inputLoginPin.value) {
    showErrorMessage('You left the pin field blank');
  } else if (
    !currentAccount &&
    inputLoginUsername.value &&
    inputLoginPin.value
  ) {
    showErrorMessage(`There is no user like ${inputLoginUsername.value}`);
  } else if (
    currentAccount?.pin !==
    Number(
      inputLoginPin.value && inputLoginUsername.value && inputLoginPin.value
    )
  ) {
    showErrorMessage(`the pin is incorrect`);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
    clearInputFields([inputTransferTo, inputTransferAmount]);
    showSuccessMessage(
      `Transfered ${amount} to ${recieverAcc.owner.split(' ')[0]}`
    );
    updateDATA();
  } else if (!inputTransferTo.value) {
    showErrorMessage('you left the transfer to field blank');
  } else if (!inputTransferAmount.value) {
    showErrorMessage('you left the transfer amount field blank');
  } else if (amount < 0) {
    showErrorMessage('amount is negative');
  } else if (!recieverAcc) {
    showErrorMessage(`there is no one like ${inputTransferTo.value}`);
  } else if (currentAccount.balance <= amount) {
    showErrorMessage("you don't have enough money");
  } else if (recieverAcc?.username === currentAccount.username) {
    showErrorMessage("you can't transfer to yourself");
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.balance > amount * 0.1) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
    clearInputFields([inputLoanAmount]);
    showSuccessMessage(`The loan of ${amount} was granted`);
    updateDATA();
  } else if (amount < 0) {
    showErrorMessage('Amount is less than zero');
  } else if (currentAccount.balance < amount * 0.1) {
    showErrorMessage(
      `You have to have a balance of ${
        amount * 0.1
      } or more to get the loan of ${amount}`
    );
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (inputCloseUsername.value !== currentAccount.username) {
    showErrorMessage('The username is wrong');
  } else if (Number(inputClosePin.value) !== currentAccount.pin) {
    showErrorMessage('The pin is incorrect');
  } else if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    //delete account`
    accounts.splice(index, 1);

    //hide Ui
    showSuccessMessage('Successfully deleted account');
    containerApp.style.display = 'none';
    containerSignup.style.display = 'grid';
    clearInputFields([inputClosePin, inputCloseUsername]);
    labelWelcome.textContent = 'Log in to get started';
    updateDATA();
  }
});
btnOk.addEventListener('click', e => {
  e.preventDefault();
  errorDiv.classList.toggle('visible');
});
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const deposits = movements.filter(mov => mov > 0);
const withdraws = movements.filter(mov => mov < 0);
const max = movements.reduce((acc, mov) => {
  if (mov > acc) {
    return mov;
  } else {
    return acc;
  }
}, movements[0]);
// console.log(max);
//////////////////////////////////////////////////

const firstWithdrawl = movements.find(mov => mov < 0);
// console.log(firstWithdrawl, movements);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//Sign up functionality
btnSignup.addEventListener('click', e => {
  e.preventDefault();
  let error = '';
  let username = inputSignupUsername.value
    .toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  let allNames = accounts.map(acc => acc.username);
  if (inputSignupUsername.value == '') {
    showErrorMessage('You left the username field blank for sign up form');
    error = true;
  } else if (inputSignupPin.value == '') {
    showErrorMessage('You left the pin field blank for sign up form');
    error = true;
  } else if (inputSignupInterest.value == '') {
    showErrorMessage('You left the interest rate field blank for sign up form');
    error = true;
  } else if (inputSignupUsername.value.split(' ').length != 2) {
    showErrorMessage('Only name and surname');
    error = true;
  } else if (inputSignupPin.value.length != 4) {
    showErrorMessage('The pin length should be only four characters');
    error = true;
  } else if (Number(inputSignupBalance.value) < 0) {
    showErrorMessage(
      "you can't have balance in negative that would mean you are bankrupt"
    );
    error = true;
  } else if (Number(inputSignupBalance.value) == 0) {
    showErrorMessage(
      "you can't have 0 balance then you couldn't do anything from our app"
    );
    error = true;
  }
  if (!error) {
    if (allNames.includes(username)) {
      username = makeRandomUsername(Math.floor(Math.random() * 6) + 1);
      console.log(username);
    }
    currentAccount.username = username;
    currentAccount.pin = Number(inputSignupPin.value);
    currentAccount.interestRate = Number(inputSignupInterest.value);
    currentAccount.movements = [];
    currentAccount.balance = Number(inputSignupBalance.value);
    currentAccount.owner = inputSignupUsername.value;
    accounts.push(currentAccount);
    updateUI(currentAccount);
    containerApp.style.display = 'grid';
    containerSignup.style.display = 'none';
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    showSuccessMessage(
      `Your account was created with this username(${username}) remember it`
    );
    updateDATA();
  }
});
