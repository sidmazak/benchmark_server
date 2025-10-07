import { availableParallelism, cpus } from 'node:os';
import cluster from 'node:cluster';
import express from 'express';
import os from 'node:os';

const numCPUs = availableParallelism();
const PORT = process.env.PORT || 3000;

// Function to get CPU core information
function getCPUInfo() {
    const cpuUsage = process.cpuUsage();
    const cpuInfo = cpus();
    return {
        cores: cpuInfo.length,
        model: cpuInfo[0]?.model || 'Unknown',
        speed: cpuInfo[0]?.speed || 'Unknown',
        usage: cpuUsage
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

    // Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Request logging middleware
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] ${req.method} ${req.path} - ${req.ip}`);
        next();
    });

    // Simple response endpoint
    app.get('/', (req, res) => {
        res.json({
            message: 'Hello from test server!',
            timestamp: new Date().toISOString(),
            server: 'load-test-server',
            version: '1.0.0'
        });
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
        res.status(200).json({
            status: 'healthy',
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            cpu: os.cpus().length,
            timestamp: new Date().toISOString()
        });
    });

    // JSON response endpoint with more data
    app.get('/api/data', (req, res) => {
        const data = {
            id: Math.floor(Math.random() * 10000),
            name: 'Test Data',
            description: 'This is a test response with JSON data',
            items: Array.from({ length: 10 }, (_, i) => ({
                id: i + 1,
                value: Math.random() * 100,
                timestamp: new Date().toISOString()
            })),
            metadata: {
                server: 'load-test-server',
                version: '1.0.0',
                requestTime: new Date().toISOString()
            }
        };

        res.json(data);
    });

    // Delayed response endpoint (simulates slow operations)
    app.get('/api/slow', (req, res) => {
        const delay = parseInt(req.query.delay) || 1000; // Default 1 second delay

        setTimeout(() => {
            res.json({
                message: 'Slow response completed',
                delay: delay,
                timestamp: new Date().toISOString()
            });
        }, delay);
    });

    // POST endpoint for testing write operations
    app.post('/api/echo', (req, res) => {
        res.json({
            message: 'Echo endpoint',
            receivedData: req.body,
            timestamp: new Date().toISOString(),
            method: req.method
        });
    });

    // Error simulation endpoint
    app.get('/api/error', (req, res) => {
        const errorType = req.query.type || '500';
        const statusCode = parseInt(errorType);

        res.status(statusCode).json({
            error: true,
            message: `Simulated ${statusCode} error`,
            timestamp: new Date().toISOString()
        });
    });

    // CPU intensive endpoint (for stress testing)
    app.get('/api/cpu-intensive', (req, res) => {
        const iterations = parseInt(req.query.iterations) || 1000000;

        // Simulate CPU intensive work
        let result = 0;
        for (let i = 0; i < iterations; i++) {
            result += Math.sqrt(i) * Math.sin(i);
        }

        res.json({
            message: 'CPU intensive operation completed',
            iterations: iterations,
            result: result,
            timestamp: new Date().toISOString()
        });
    });

    // Memory intensive endpoint
    app.get('/api/memory-intensive', (req, res) => {
        const size = parseInt(req.query.size) || 1000000; // Default 1M items
        const array = new Array(size).fill(0).map(() => Math.random());

        res.json({
            message: 'Memory intensive operation completed',
            arraySize: size,
            sampleValue: array[Math.floor(Math.random() * size)],
            timestamp: new Date().toISOString()
        });
    });

    // Server statistics endpoint
    app.get('/api/stats', (req, res) => {
        const stats = {
            server: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: {
                    cores: os.cpus().length,
                    loadAverage: os.loadavg()
                },
                platform: os.platform(),
                arch: os.arch(),
                nodeVersion: process.version
            },
            timestamp: new Date().toISOString()
        };

        res.json(stats);
    });

    // Error handler
    app.use((err, req, res, next) => {
        console.error('Server Error:', err);
        res.status(500).json({
            error: 'Internal Server Error',
            message: err.message,
            timestamp: new Date().toISOString()
        });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        process.exit(0);
    });

    process.on('SIGINT', () => {
        console.log('SIGINT received, shutting down gracefully');
        process.exit(0);
    });

    // Start server
    app.listen(PORT, () => {
        console.log(`🚀 Test server running on http://localhost:${PORT}`);
        console.log(`📊 Available endpoints:`);
        console.log(`   GET  /                    - Simple response`);
        console.log(`   GET  /health              - Health check`);
        console.log(`   GET  /api/data            - JSON data response`);
        console.log(`   GET  /api/slow?delay=1000 - Delayed response`);
        console.log(`   POST /api/echo            - Echo POST data`);
        console.log(`   GET  /api/error?type=500  - Error simulation`);
        console.log(`   GET  /api/cpu-intensive   - CPU intensive task`);
        console.log(`   GET  /api/memory-intensive - Memory intensive task`);
        console.log(`   GET  /api/stats           - Server statistics`);
        console.log(`\n💡 Use Ctrl+C to stop the server`);
        console.log(`Worker ${process.pid} started on core ${process.pid % cpuInfo.cores}`);
    });
}