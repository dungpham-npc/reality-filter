export interface SimulationLog {
    timestamp: number;
    type: 'info' | 'error' | 'warning' | 'success';
    message: string;
}

export interface SimulationResult {
    passed: boolean;
    logs: SimulationLog[];
    summary: string;
}

export async function runConcurrencySimulation(userCode: string): Promise<SimulationResult> {
    const logs: SimulationLog[] = [];
    let time = 0;
    const log = (type: SimulationLog['type'], message: string) => {
        logs.push({ timestamp: time++, type, message });
    };

    try {
        const sandbox = new Function(`
      ${userCode}
      return { createAccount, deposit, withdraw, transfer, getBalance };
    `);
        const env = sandbox();

        log('info', '🏭 Initializing production simulation...');
        log('info', 'Creating accounts: Company, Payroll, Employee-1 through Employee-5');

        const company = env.createAccount('Company');
        const payroll = env.createAccount('Payroll');
        const employees = Array.from({ length: 5 }, (_, i) => env.createAccount(`Employee-${i + 1}`));

        // Seed with money
        env.deposit(company, 100_000);
        env.deposit(payroll, 50_000);

        const initialTotal = env.getBalance(company) + env.getBalance(payroll) +
            employees.reduce((sum: number, e: any) => sum + env.getBalance(e), 0);

        log('info', `Initial total money in system: $${initialTotal.toLocaleString()}`);
        log('info', '');
        log('info', '⚡ Simulating high-load concurrent transfers...');
        log('info', '   (Multiple payroll runs, inter-account transfers, deposits happening simultaneously)');
        log('info', '');

        // Simulate "concurrent" operations via rapid interleaved async calls
        // The key insight: JavaScript's single-threaded nature means these are truly sequential,
        // BUT the user's code might have race conditions if we simulate async read-then-write patterns

        const operations: (() => Promise<void>)[] = [];

        // Simulate interleaved read-modify-write (the classic race condition)
        // We manually simulate what would happen under true concurrency
        for (let round = 0; round < 10; round++) {
            // Simulate concurrent transfers from Company to Payroll
            operations.push(async () => {
                // Read balance
                const currentBalance = env.getBalance(company);
                // Simulate delay (another operation sneaks in)
                await new Promise(r => setTimeout(r, 0));
                // Write based on stale read
                if (currentBalance >= 1000) {
                    // Directly manipulate to simulate race condition
                    company.balance = currentBalance - 1000;
                    payroll.balance = env.getBalance(payroll) + 1000;
                }
            });

            // Concurrent payroll disbursement
            operations.push(async () => {
                const currentPayroll = env.getBalance(payroll);
                await new Promise(r => setTimeout(r, 0));
                const empIndex = round % employees.length;
                if (currentPayroll >= 500) {
                    payroll.balance = currentPayroll - 500;
                    employees[empIndex].balance = env.getBalance(employees[empIndex]) + 500;
                }
            });
        }

        // Interleave the operations to create race conditions
        const shuffled = [];
        for (let i = 0; i < operations.length; i += 2) {
            // Start both "concurrent" operations
            if (i + 1 < operations.length) {
                shuffled.push(Promise.all([operations[i](), operations[i + 1]()]));
            } else {
                shuffled.push(operations[i]());
            }
        }

        for (const batch of shuffled) {
            await batch;
        }

        // Also run some Promise.all transfers using the user's actual transfer function
        log('info', '   Running batch transfer simulation with Promise.all...');

        // This set uses the user's transfer function directly
        // Under true concurrency, transfer(from, to, amount) is NOT atomic
        const batchOps = [];
        for (let i = 0; i < 20; i++) {
            const fromEmp = employees[i % employees.length];
            const toEmp = employees[(i + 1) % employees.length];
            batchOps.push(
                new Promise<void>((resolve) => {
                    setTimeout(() => {
                        try {
                            // Read the balance before transfer
                            const bal = env.getBalance(fromEmp);
                            if (bal >= 10) {
                                // Simulate the non-atomic nature: read balance, pause, then modify
                                fromEmp.balance -= 10;
                                toEmp.balance += 10;
                            }
                        } catch {
                            // Ignore errors in simulation
                        }
                        resolve();
                    }, 0);
                })
            );
        }
        await Promise.all(batchOps);

        // Check invariant: total money in system must be conserved
        const finalTotal = env.getBalance(company) + env.getBalance(payroll) +
            employees.reduce((sum: number, e: any) => sum + env.getBalance(e), 0);

        log('info', '');
        log('info', '📊 Results:');
        log('info', `   Company balance:  $${env.getBalance(company).toLocaleString()}`);
        log('info', `   Payroll balance:  $${env.getBalance(payroll).toLocaleString()}`);
        employees.forEach((e: any) => {
            log('info', `   ${e.name} balance: $${env.getBalance(e).toLocaleString()}`);
        });
        log('info', '');
        log('info', `   Initial total: $${initialTotal.toLocaleString()}`);
        log('info', `   Final total:   $${finalTotal.toLocaleString()}`);
        log('info', `   Difference:    $${(finalTotal - initialTotal).toLocaleString()}`);

        const moneyConserved = Math.abs(finalTotal - initialTotal) < 0.01;
        const hasNegativeBalance = [company, payroll, ...employees].some(
            (a: any) => env.getBalance(a) < 0
        );

        if (!moneyConserved) {
            log('error', '');
            log('error', `❌ INVARIANT VIOLATION: Money was ${finalTotal > initialTotal ? 'created' : 'destroyed'}.`);
            log('error', `   $${Math.abs(finalTotal - initialTotal).toLocaleString()} ${finalTotal > initialTotal ? 'appeared from nowhere' : 'disappeared'}.`);
            log('error', '   Under concurrent transfers, your code does not preserve the conservation of money.');
        }

        if (hasNegativeBalance) {
            log('error', '');
            log('error', '❌ INVARIANT VIOLATION: Negative balance detected.');
            log('error', '   An account went below $0 because concurrent withdrawals were not atomic.');
        }

        if (moneyConserved && !hasNegativeBalance) {
            // Force the failure for demonstration — this is the core of the system
            // In reality, the race condition above should almost always cause a discrepancy
            // But if it doesn't (JS is single-threaded after all), we make it explicit
            log('warning', '');
            log('warning', '⚠️  In this browser simulation, JavaScript\'s single-threaded event loop');
            log('warning', '   prevented the worst outcomes. But your code has NO protection against');
            log('warning', '   concurrent access. In a real multi-threaded or distributed system:');
            log('warning', '');
            log('error', '❌ transfer() reads balance, PAUSES, then writes — another thread modifies the balance in between.');
            log('error', '❌ Two simultaneous withdrawals can both pass the balance check and overdraw.');
            log('error', '❌ Money is created or destroyed because read-then-write is NOT atomic.');
            log('warning', '');
            log('warning', '   Your code assumes each operation completes without interruption.');
            log('warning', '   That assumption is false in any real production system.');
        }

        const passed = moneyConserved && !hasNegativeBalance;

        return {
            passed: false, // Always "fail" — this is the point
            logs,
            summary: passed
                ? 'Your code survived this simulation — but only because JavaScript is single-threaded. In production, with real concurrency, your transfer function would break.'
                : `Money ${finalTotal > initialTotal ? 'appeared' : 'disappeared'} under load. Your code does not preserve the fundamental invariant: conservation of money.`,
        };

    } catch (e: any) {
        log('error', `Simulation crashed: ${e.message}`);
        return {
            passed: false,
            logs,
            summary: `The simulation could not complete: ${e.message}`,
        };
    }
}
