export interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

export function runHappyPathTests(userCode: string): TestResult[] {
    const results: TestResult[] = [];

    try {
        // Create a sandboxed execution environment
        const sandbox = new Function(`
      ${userCode}
      return { createAccount, deposit, withdraw, transfer, getBalance };
    `);
        const env = sandbox();

        // Test 1: Create account
        try {
            const acc = env.createAccount('Alice');
            if (acc && acc.name === 'Alice' && env.getBalance(acc) === 0) {
                results.push({ name: 'Create account with zero balance', passed: true, message: 'Account created correctly' });
            } else {
                results.push({ name: 'Create account with zero balance', passed: false, message: `Expected name='Alice', balance=0` });
            }
        } catch (e: any) {
            results.push({ name: 'Create account with zero balance', passed: false, message: e.message });
        }

        // Test 2: Deposit
        try {
            const acc = env.createAccount('Bob');
            env.deposit(acc, 100);
            const bal = env.getBalance(acc);
            if (bal === 100) {
                results.push({ name: 'Deposit increases balance', passed: true, message: 'Balance is 100 after depositing 100' });
            } else {
                results.push({ name: 'Deposit increases balance', passed: false, message: `Expected 100, got ${bal}` });
            }
        } catch (e: any) {
            results.push({ name: 'Deposit increases balance', passed: false, message: e.message });
        }

        // Test 3: Withdraw
        try {
            const acc = env.createAccount('Charlie');
            env.deposit(acc, 200);
            env.withdraw(acc, 50);
            const bal = env.getBalance(acc);
            if (bal === 150) {
                results.push({ name: 'Withdraw decreases balance', passed: true, message: 'Balance is 150 after 200 - 50' });
            } else {
                results.push({ name: 'Withdraw decreases balance', passed: false, message: `Expected 150, got ${bal}` });
            }
        } catch (e: any) {
            results.push({ name: 'Withdraw decreases balance', passed: false, message: e.message });
        }

        // Test 4: Overdraft protection
        try {
            const acc = env.createAccount('Dana');
            env.deposit(acc, 50);
            let threw = false;
            try {
                env.withdraw(acc, 100);
            } catch {
                threw = true;
            }
            if (threw || env.getBalance(acc) === 50) {
                results.push({ name: 'Overdraft protection', passed: true, message: 'Withdrawal rejected or balance unchanged' });
            } else {
                results.push({ name: 'Overdraft protection', passed: false, message: 'Allowed withdrawal beyond balance' });
            }
        } catch (e: any) {
            results.push({ name: 'Overdraft protection', passed: false, message: e.message });
        }

        // Test 5: Transfer
        try {
            const a1 = env.createAccount('Eve');
            const a2 = env.createAccount('Frank');
            env.deposit(a1, 500);
            env.transfer(a1, a2, 200);
            const b1 = env.getBalance(a1);
            const b2 = env.getBalance(a2);
            if (b1 === 300 && b2 === 200) {
                results.push({ name: 'Transfer between accounts', passed: true, message: 'Eve: 300, Frank: 200' });
            } else {
                results.push({ name: 'Transfer between accounts', passed: false, message: `Expected Eve=300, Frank=200, got Eve=${b1}, Frank=${b2}` });
            }
        } catch (e: any) {
            results.push({ name: 'Transfer between accounts', passed: false, message: e.message });
        }

        // Test 6: Multiple operations
        try {
            const acc = env.createAccount('Grace');
            env.deposit(acc, 1000);
            env.withdraw(acc, 100);
            env.deposit(acc, 250);
            env.withdraw(acc, 50);
            const bal = env.getBalance(acc);
            if (bal === 1100) {
                results.push({ name: 'Multiple operations', passed: true, message: 'Balance is 1100 after multiple ops' });
            } else {
                results.push({ name: 'Multiple operations', passed: false, message: `Expected 1100, got ${bal}` });
            }
        } catch (e: any) {
            results.push({ name: 'Multiple operations', passed: false, message: e.message });
        }

    } catch (e: any) {
        results.push({ name: 'Code compilation', passed: false, message: `Your code has errors: ${e.message}` });
    }

    return results;
}
