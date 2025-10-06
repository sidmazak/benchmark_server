import express from 'express';
import { cpus } from 'node:os';

const app = express();

// Function to get CPU core information
function getCPUInfo() {
    const cpuInfo = cpus();
    return {
        cores: cpuInfo.length,
        model: cpuInfo[0]?.model || 'Unknown',
        speed: cpuInfo[0]?.speed || 'Unknown'
    };
}

const cpuInfo = getCPUInfo();
console.log(`Single process server - PID: ${process.pid}, running on core ${process.pid % cpuInfo.cores}, CPU Model: ${cpuInfo.model}, Speed: ${cpuInfo.speed}MHz`);

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
    console.log(`Server is running on port 3000 - PID: ${process.pid}, Core: ${process.pid % cpuInfo.cores}`);
});