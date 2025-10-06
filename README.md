# Benchmark Server

A Node.js Express server designed for performance benchmarking and load testing using autocannon. This project provides two server implementations to compare single-process vs cluster-based performance.

## 🚀 Features

- **Single Process Server** (`server-normal.js`) - Traditional single-threaded Express server
- **Cluster Server** (`server-cluster.js`) - Multi-process cluster implementation using all CPU cores
- **CPU Information Logging** - Displays CPU cores, model, and speed information
- **Docker Support** - Containerized deployment with Dockerfile
- **Load Testing Ready** - Optimized for autocannon benchmarking

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
- `GET /` - Returns a computed sum (CPU-intensive operation for testing)

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

## 🔍 Monitoring

The servers log detailed information including:
- Process ID (PID)
- CPU core assignment
- CPU model and speed
- Worker process information (cluster mode)

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