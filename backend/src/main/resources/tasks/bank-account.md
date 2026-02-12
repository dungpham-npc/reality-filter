---
title: Bank Account
---

## Bank Account

Implement a `BankAccount` system with the following:

1. **`createAccount(name)`** — Creates a new account with the given name and a balance of 0. Returns the account object.
2. **`deposit(account, amount)`** — Adds the amount to the account's balance.
3. **`withdraw(account, amount)`** — Subtracts the amount from the account's balance. Should not allow negative balances.
4. **`transfer(from, to, amount)`** — Transfers the given amount from one account to another.
5. **`getBalance(account)`** — Returns the current balance of the account.

All functions should be exported or available in the global scope.

**Constraints:**
- Amounts are always positive numbers
- An account name is a non-empty string
- Withdrawals that would result in negative balance should be rejected (throw an error or return false)

```js
// Implement your BankAccount system here

function createAccount(name) {
  return { name, balance: 0 };
}

function deposit(account, amount) {
  account.balance += amount;
}

function withdraw(account, amount) {
  if (account.balance < amount) {
    throw new Error("Insufficient funds");
  }
  account.balance -= amount;
}

function transfer(from, to, amount) {
  withdraw(from, amount);
  deposit(to, amount);
}

function getBalance(account) {
  return account.balance;
}
```
