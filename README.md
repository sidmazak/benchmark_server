# Benchmark Server

A Node.js Express server designed for performance benchmarking and load testing using autocannon. This project provides two server implementations to compare single-process vs cluster-based performance.

## 🚀 Features

- **Single Process Server** (`server-normal.js`) - Traditional single-threaded Express server
- **Cluster Server** (`server-cluster.js`) - Multi-process cluster implementation using all CPU cores
- **CPU Information Logging** - Displays CPU cores, model, and speed information
- **Docker Support** - Containerized deployment with Dockerfile
- **Load Testing Ready** - Optimized for autocannon benchmarking
- **Multiple Test Endpoints** - Various endpoints for different testing scenarios
- **Health Monitoring** - Built-in health check and server statistics endpoints
- **Performance Testing** - CPU and memory intensive endpoints for stress testing

## 📋 Prerequisites

- Node.js 20+ 
- npm or yarn
- Docker (optional)
- autocannon (for benchmarking)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd benchmark_server
```

2. Install dependencies:
```bash
npm install
```

3. Install autocannon globally (for benchmarking):
```bash
npm install -g autocannon
```

## 🏃‍♂️ Running the Servers

### Single Process Server
```bash
node server-normal.js
```

### Cluster Server (Recommended for Production)
```bash
node server-cluster.js
```

Both servers will start on port 3000 and display CPU information in the console.

## 🐳 Docker Usage

### Build the Docker Image
```bash
docker build -t benchmark-server .
```

### Run Single Process Version
```bash
docker run -p 3000:3000 benchmark-server node server-normal.js
```

### Run Cluster Version (Default)
```bash
docker run -p 3000:3000 benchmark-server
```

## 📊 Benchmarking with Autocannon

### Basic Benchmark
```bash
autocannon http://localhost:3000
```

### Advanced Benchmarking Options
```bash
# 1000 connections, 10 seconds duration
autocannon -c 1000 -d 10 http://localhost:3000

# 500 connections, 30 seconds duration, 2 workers
autocannon -c 500 -d 30 -w 2 http://localhost:3000

# Custom request rate (1000 requests per second)
autocannon -R 1000 -d 10 http://localhost:3000
```

### Specific Endpoint Testing
```bash
# Test CPU-intensive endpoint
autocannon -c 100 -d 10 http://localhost:3000/api/cpu-intensive

# Test memory-intensive endpoint
autocannon -c 100 -d 10 http://localhost:3000/api/memory-intensive

# Test slow endpoint with delays
autocannon -c 50 -d 10 http://localhost:3000/api/slow?delay=500

# Test POST endpoint
autocannon -c 100 -d 10 -m POST -H "Content-Type: application/json" -b '{"test": "data"}' http://localhost:3000/api/echo

# Test health endpoint
autocannon -c 200 -d 10 http://localhost:3000/health
```

### Compare Both Servers

1. **Start Single Process Server:**
```bash
node server-normal.js
```

2. **In another terminal, run benchmark:**
```bash
autocannon -c 100 -d 10 http://localhost:3000
```

3. **Stop single process server and start cluster server:**
```bash
node server-cluster.js
```

4. **Run the same benchmark:**
```bash
autocannon -c 100 -d 10 http://localhost:3000
```

## 📈 Expected Results

The cluster server should typically show:
- **Higher throughput** (requests per second)
- **Lower latency** under high load
- **Better CPU utilization** across all cores
- **More stable performance** under sustained load

## 🔧 Configuration

### Environment Variables
- `PORT` - Server port (default: 3000)
- `WORKERS` - Number of cluster workers (default: CPU cores)

### Server Endpoints

#### Basic Endpoints
- `GET /` - Simple JSON response with server info
- `GET /health` - Health check with server status and metrics
- `GET /api/stats` - Detailed server statistics and system information

#### Data Endpoints
- `GET /api/data` - JSON response with sample data array
- `POST /api/echo` - Echo endpoint for testing POST requests

#### Performance Testing Endpoints
- `GET /api/cpu-intensive?iterations=1000000` - CPU-intensive mathematical operations
- `GET /api/memory-intensive?size=1000000` - Memory-intensive array operations
- `GET /api/slow?delay=1000` - Configurable delayed response (simulates slow operations)

#### Error Testing Endpoints
- `GET /api/error?type=500` - Simulated error responses (400, 500, etc.)

## 📝 Project Structure

```
benchmark_server/
├── server-normal.js      # Single process server
├── server-cluster.js     # Cluster-based server
├── Dockerfile           # Docker configuration
├── package.json         # Dependencies and scripts
└── README.md           # This file
```

## 🎯 Use Cases

- **Performance Testing** - Compare different server architectures
- **Load Testing** - Test application behavior under stress
- **CPU Utilization Analysis** - Understand multi-core performance
- **Docker Performance** - Benchmark containerized applications
- **Development** - Quick server setup for testing
- **API Testing** - Test various endpoint types (GET, POST, error handling)
- **Resource Stress Testing** - Test CPU and memory intensive operations
- **Latency Testing** - Test delayed response scenarios

## 🔍 Monitoring

The servers provide comprehensive monitoring capabilities:

### Console Logging
- Process ID (PID) and CPU core assignment
- CPU model and speed information
- Worker process information (cluster mode)
- Request logging with timestamps and IP addresses

### Health Endpoints
- `/health` - Basic health status and system metrics
- `/api/stats` - Detailed server statistics including:
  - Uptime and memory usage
  - CPU information and load averages
  - Platform and architecture details
  - Node.js version information

## 📚 Additional Resources

- [Autocannon Documentation](https://github.com/mcollina/autocannon)
- [Node.js Cluster Module](https://nodejs.org/api/cluster.html)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with autocannon
5. Submit a pull request

## 📄 License

ISC License - see package.json for details