import { availableParallelism } from 'node:os';
import cluster from 'node:cluster';
import express from 'express';

const numCPUs = availableParallelism();

if (cluster.isPrimary) {
    console.log(`Primary ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
} else {
    const app = express();
    app.get('/', (req, res) => {
        let sum = 0;
        for (let i = 0; i < 100000; i++) {
            sum += i;
        }
        res.send({
            sum: sum
        });
    });
    app.listen(3000, () => {
        console.log(`Worker ${process.pid} started`);
    });
    console.log(`Worker ${process.pid} started`);
}