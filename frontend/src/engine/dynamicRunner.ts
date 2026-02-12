// Dynamic runner for entry-specific test and simulation code.
// Executes JavaScript strings from SoupEntry fields in sandboxed Function() constructors.

export interface TestResult {
    name: string;
    passed: boolean;
    message: string;
}

export interface SimulationLog {
    type: 'info' | 'error' | 'warning' | 'success';
    message: string;
}

export interface SimulationResult {
    passed: boolean;
    logs: SimulationLog[];
    summary: string;
}

/**
 * Runs the entry's test code against the user's solution code.
 * 
 * The testsCode should be a function body that:
 * - Receives `userCode` as a parameter (the user's JS code string)
 * - Returns TestResult[]
 */
export function runDynamicTests(userCode: string, testsCode: string): TestResult[] {
    try {
        const testFn = new Function('userCode', testsCode);
        const results = testFn(userCode);
        if (!Array.isArray(results)) {
            return [{ name: 'Test Runner', passed: false, message: 'Test code did not return an array' }];
        }
        return results;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return [{ name: 'Test Runner Error', passed: false, message }];
    }
}

/**
 * Runs the entry's simulation code against the user's solution code.
 * 
 * The simulationCode should be a function body that:
 * - Receives `userCode` as a parameter
 * - Returns a SimulationResult (or a Promise<SimulationResult>)
 */
export async function runDynamicSimulation(userCode: string, simulationCode: string): Promise<SimulationResult> {
    try {
        const simFn = new Function('userCode', simulationCode);
        const result = await simFn(userCode);
        if (!result || typeof result !== 'object') {
            return {
                passed: false,
                logs: [{ type: 'error', message: 'Simulation code did not return a valid result' }],
                summary: 'Simulation error',
            };
        }
        return result;
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        return {
            passed: false,
            logs: [{ type: 'error', message: `Simulation error: ${message}` }],
            summary: 'Simulation crashed',
        };
    }
}
