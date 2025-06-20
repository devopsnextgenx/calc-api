import express, { Request, Response } from 'express';
import { CalcNapi } from './bindings';

const app = express();
app.use(express.json());

const calc = new CalcNapi('trzxs9');

app.post('/api/v1/calc/add', (req: Request, res: Response) => {
    const { a, b } = req.body;
    res.json({ result: calc.add(a, b) });
});

app.post('/api/v1/calc/sub', (req: Request, res: Response) => {
    const { a, b } = req.body;
    res.json({ result: calc.sub(a, b) });
});

app.post('/api/v1/calc/mul', (req: Request, res: Response) => {
    const { a, b } = req.body;
    res.json({ result: calc.mul(a, b) });
});

app.post('/api/v1/calc/divx', (req: Request, res: Response) => {
    const { a, b } = req.body;
    if (Number(b) === 0) {
        res.status(400).json({ error: 'Division by zero' });
    }
    res.json({ result: calc.divx(a, b) });
});

app.post('/api/v1/calc/sqr', (req: Request, res: Response) => {
    const { a } = req.body;
    res.json({ result: calc.sqr(a) });
});

app.get('/api/v1/calc/version', (_req: Request, res: Response) => {
    res.json({ version: '1.0.0' });
});

app.get('/api/v1/calc/help', (_req: Request, res: Response) => {
    res.json({
        endpoints: [
            { method: 'POST', path: '/api/v1/calc/add', body: '{ a, b }' },
            { method: 'POST', path: '/api/v1/calc/sub', body: '{ a, b }' },
            { method: 'POST', path: '/api/v1/calc/mul', body: '{ a, b }' },
            { method: 'POST', path: '/api/v1/calc/div', body: '{ a, b }' },
            { method: 'POST', path: '/api/v1/calc/sqr', body: '{ a }' },
            { method: 'GET', path: '/api/v1/calc/version' },
            { method: 'GET', path: '/api/v1/calc/usage' }
        ]
    });
});

app.get('/api/v1/calc/usage', (_req: Request, res: Response) => {

    res.json({
        usage: calc.getUsage()
    });
});

app.get('/api/v1/calc/add', (req: Request, res: Response) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    res.json({ result: calc.add(a, b) });
});

app.get('/api/v1/calc/sub', (req: Request, res: Response) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    res.json({ result: calc.sub(a, b) });
});

app.get('/api/v1/calc/mul', (req: Request, res: Response) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    res.json({ result: calc.mul(a, b) });
});

app.get('/api/v1/calc/divx', (req: Request, res: Response) => {
    const a = Number(req.query.a);
    const b = Number(req.query.b);
    if (b === 0) {
        res.status(400).json({ error: 'Division by zero' });
        return;
    }
    res.json({ result: calc.divx(a, b) });
});

app.get('/api/v1/calc/sqr', (req: Request, res: Response) => {
    const a = Number(req.query.a);
    res.json({ result: calc.sqr(a) });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Calc API server running on port ${PORT}`);
});