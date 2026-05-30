# Use a specific, pinned lightweight Alpine image
FROM node:22.14.0-alpine

# Set production environment
ENV NODE_ENV=production

# Create and set the working directory
WORKDIR /usr/src/app

# Copy dependency manifests and set ownership to node user
COPY --chown=node:node package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy remaining source code and set ownership
COPY --chown=node:node . .

#  non-root node user for runtime security
USER node

EXPOSE 3000

# Start application
CMD [ "node", "index.js" ]

