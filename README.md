# SimpleAPI

A simple to-do list API built with Express.js, featuring Swagger documentation, Docker support, and CI/CD integration.

## Features
- **To-Do Management**: Add, update, delete, and retrieve to-do items.
- **Health Check**: `/health` endpoint to monitor service health.
- **Version Information**: Root (`/`) endpoint displays API metadata from `version.json`.
- **Swagger Documentation**: Comprehensive API docs at `/api-docs`.
- **Production-Ready**: Dockerized setup and GitLab CI pipeline.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)

---

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/simpleapi.git
   cd simpleapi
   ```
2. Install dependencies:
   ```bash
    npm install
    ```
3. Start the server:
    ```bash
    npm start
    ```
4. Access the API at `http://localhost:3000`.
 - Root: `http://localhost:3000/`
 - Swagger Docs: `http://localhost:3000/api-docs`
 - Health Check: `http://localhost:3000/health`
