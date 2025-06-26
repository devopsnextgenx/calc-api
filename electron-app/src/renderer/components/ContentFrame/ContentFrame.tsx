import React, { useState, useEffect } from 'react';
import './ContentFrame.css';

const ContentFrame: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [result, setResult] = useState('');
    const [calcApiReady, setCalcApiReady] = useState(false);
    const [error, setError] = useState('');
    const [version, setVersion] = useState('');

    useEffect(() => {
        console.log('ContentFrame useEffect called');
        const initializeCalc = async () => {
            try {
                if (window.electron?.calcNapi) {
                    const initResult = await window.electron.calcNapi.createInstance('trzxs9');
                    if (initResult.success) {
                        setCalcApiReady(true);
                        setVersion(initResult.version ?? '');
                        setError('');
                        console.log('Calc API initialized successfully');
                    } else {
                        setError(`Failed to initialize calc API: ${initResult.error}`);
                    }
                } else {
                    setError('calcNapi library not available');
                }
            } catch (err: any) {
                setError(`Initialization failed: ${err.message}`);
            }
        };

        initializeCalc();
    }, []);

    const validateInput = (inputText: string): { operation: string; parts: string[] } | null => {
        const parts = inputText.split(',').map(part => part.trim());
        if (parts.length < 2) {
            setError('Please enter operation and numbers (e.g., "add, 5, 8" or "sqr, 5")');
            return null;
        }

        const operation = parts[0].toLowerCase();
        const validOperations = ['add', 'sub', 'mul', 'divx', 'sqr'];
        
        if (!validOperations.includes(operation)) {
            setError(`Invalid operation. Valid operations: ${validOperations.join(', ')}`);
            return null;
        }

        return { operation, parts };
    };

    const performSquareOperation = async (parts: string[]): Promise<string | null> => {
        if (parts.length !== 2) {
            setError('Square operation requires one number (e.g., "sqr, 5")');
            return null;
        }
        const a = parseFloat(parts[1]);
        if (isNaN(a)) {
            setError('Please enter a valid number');
            return null;
        }
        const calcResult = await window.electron.calcNapi.sqr(a);
        return `${a}² = ${calcResult}`;
    };

    const performBinaryOperation = async (operation: string, parts: string[]): Promise<string | null> => {
        if (parts.length !== 3) {
            setError(`${operation} operation requires two numbers (e.g., "${operation}, 5, 8")`);
            return null;
        }
        const a = parseFloat(parts[1]);
        const b = parseFloat(parts[2]);
        if (isNaN(a) || isNaN(b)) {
            setError('Please enter valid numbers');
            return null;
        }

        if (operation === 'divx' && b === 0) {
            setError('Division by zero is not allowed');
            return null;
        }

        let calcResult: any;
        let operationSymbol: string;

        switch (operation) {
            case 'add':
                calcResult = await window.electron.calcNapi.add(a, b);
                operationSymbol = '+';
                break;
            case 'sub':
                calcResult = await window.electron.calcNapi.sub(a, b);
                operationSymbol = '-';
                break;
            case 'mul':
                calcResult = await window.electron.calcNapi.mul(a, b);
                operationSymbol = '×';
                break;
            case 'divx':
                calcResult = await window.electron.calcNapi.divx(a, b);
                operationSymbol = '÷';
                break;
            default:
                setError('Unknown operation');
                return null;
        }
        return `${a} ${operationSymbol} ${b} = ${calcResult}`;
    };

    const processCalculationResult = (calcResult: any, resultDisplay: string): void => {
        if (typeof calcResult === 'object' && calcResult !== null) {
            const result = calcResult;
            if (result.status === 'error') {
                setError(`Calculation failed: ${result.errorMessage ?? 'Unknown error'}`);
                setResult('');
                return;
            } else if (result.result !== undefined) {
                setResult(resultDisplay.replace(`= ${calcResult}`, `= ${result.result}`));
            } else {
                setResult(resultDisplay.replace(`= ${calcResult}`, `= ${JSON.stringify(calcResult)}`));
            }
        } else {
            setResult(resultDisplay);
        }
        setError('');
    };

    const handleCalculate = async () => {
        try {
            if (!inputText) {
                setError('Please enter operation and numbers');
                return;
            }
            if (!calcApiReady) {
                setError('Library not loaded yet');
                return;
            }

            const validationResult = validateInput(inputText);
            if (!validationResult) return;

            const { operation, parts } = validationResult;
            let resultDisplay: string | null;

            if (operation === 'sqr') {
                resultDisplay = await performSquareOperation(parts);
            } else {
                resultDisplay = await performBinaryOperation(operation, parts);
            }

            if (!resultDisplay) return;

            // Extract the calc result from the display string for processing
            const calcResultRegex = /= (.+)$/;
            const calcResultMatch = calcResultRegex.exec(resultDisplay);
            if (calcResultMatch) {
                const calcResult = calcResultMatch[1];
                processCalculationResult(calcResult, resultDisplay);
            } else {
                setResult(resultDisplay);
                setError('');
            }
        } catch (err: any) {
            setError(`Calculation failed: ${err.message}`);
        }
    };

    return (
        <div className="content-frame">
            <div className="encoding-container">
                <div className="library-info">
                    <small>Library status: {calcApiReady ? `Loaded (v${version})` : 'Not loaded'}</small>
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter operation and numbers (e.g., add, 5, 8 or sqr, 5)"
                    />
                    <button onClick={handleCalculate}>Calculate</button>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                {result && (
                    <div className="result">
                        <h3>Result:</h3>
                        <pre>{result}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentFrame;