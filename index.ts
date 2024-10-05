import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import typeDefs from './app/graphql/typeDefs';
import resolvers from './app/graphql/resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/',
});
const wsServerCleanup = useServer(
  {
    schema,
  },
  wsServer
);

const apolloServer = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await wsServerCleanup.dispose();
          },
        };
      },
    },
  ],
});

(async () => {
  try {
    await apolloServer.start();
    app.use(
      cors(),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async ({ req }) => ({ req }),
      })
    );
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
})();

httpServer.listen(3000, () => {
  console.log(`🚀 Server running at http://localhost:${3000}`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${3000}`);
});
