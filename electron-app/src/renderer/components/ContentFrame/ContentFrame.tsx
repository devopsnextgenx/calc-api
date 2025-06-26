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

    const handleEncode = async () => {
        try {
            if (!inputText) {
                setError('Please enter some text to encode');
                return;
            }
            if (!calcApiReady) {
                setError('Library not loaded yet');
                return;
            }

            // Parse input as numbers for calculation
            const numbers = inputText.split(',').map(n => parseFloat(n.trim()));
            if (numbers.length < 2 || numbers.some(isNaN)) {
                setError('Please enter two numbers separated by comma (e.g., 5, 8)');
                return;
            }

            const calcResult = await window.electron.calcNapi.add(numbers[0], numbers[1]);
            
            // Handle the response properly - it might be a JSON object
            if (typeof calcResult === 'object' && calcResult !== null) {
                const result = calcResult as any;
                if (result.status === 'error') {
                    setError(`Calculation failed: ${result.errorMessage ?? 'Unknown error'}`);
                    setResult('');
                    return;
                } else if (result.result !== undefined) {
                    setResult(`${numbers[0]} + ${numbers[1]} = ${result.result}`);
                } else {
                    setResult(`${numbers[0]} + ${numbers[1]} = ${JSON.stringify(calcResult)}`);
                }
            } else {
                setResult(`${numbers[0]} + ${numbers[1]} = ${calcResult}`);
            }
            setError('');
        } catch (err: any) {
            setError(`Calc failed: ${err.message}`);
        }
    };

    return (
        <div className="content-frame">
            <div className="encoding-container">
                <div className="library-info">
                    <small>Library statusx: {calcApiReady ? `Loaded (v${version})` : 'Not loaded'}</small>
                </div>
                <div className="input-group">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        placeholder="Enter two numbers separated by comma (e.g., 5, 8)"
                    />
                    <button onClick={handleEncode}>Calculate</button>
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