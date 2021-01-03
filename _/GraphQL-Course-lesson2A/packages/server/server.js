const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers');
 
const PORT = 3500;

const server = new ApolloServer({ typeDefs, resolvers });
 
const app = express();

server.applyMiddleware({ 
  app,
  path: '/graphql'
});

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
