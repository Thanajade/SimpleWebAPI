# Install Dependencies
npm install express supertest jest

# Run Test
npm test

# Build and run with podman compose
podman-compose up --build

# Down podman compose
podman-compose down --remove-orphan

