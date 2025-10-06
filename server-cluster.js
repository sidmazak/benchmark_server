import { availableParallelism, cpus } from 'node:os';
import cluster from 'node:cluster';
import express from 'express';

const numCPUs = availableParallelism();

// Function to get CPU core information
function getCPUInfo() {
    const cpuUsage = process.cpuUsage();
    const cpuInfo = cpus();
    return {
        cores: cpuInfo.length,
        model: cpuInfo[0]?.model || 'Unknown',
        speed: cpuInfo[0]?.speed || 'Unknown'
    };
}

const cpuInfo = getCPUInfo();
console.log(`Number of CPUs: ${numCPUs}, Total cores: ${cpuInfo.cores}, CPU Model: ${cpuInfo.model}, Speed: ${cpuInfo.speed}MHz, PID: ${process.pid}`);

if (cluster.isPrimary) {
    console.log(`Primary process ${process.pid} is running on core ${process.pid % cpuInfo.cores}`);

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
        console.log(`Worker ${process.pid} started on core ${process.pid % cpuInfo.cores}`);
    });
    console.log(`Worker ${process.pid} started on core ${process.pid % cpuInfo.cores}`);
}