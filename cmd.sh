# Install Dependencies
npm install express supertest jest

# Run Test
npm test

# Build and run with podman compose
podman-compose up -d --build

# Down podman compose
podman-compose down --remove-orphan

# Build dist
rm -rf node_modules/.cache
npm run build

# Run dist
node dist/index.js