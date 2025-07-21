import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { ApolloServer } from '@apollo/server';
import {
  ExpressContextFunctionArgument,
  expressMiddleware
} from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import { typeDefs, resolvers } from './schema';

import { checkAuth } from './middleware/auth.middleware';
import { mongoUri, port } from './config';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const app = express();
const httpServer = createServer(app);

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subscriptions'
});
const wsServerCleanup = useServer(
  {
    schema
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
          }
        };
      }
    }
  ]
});

(async () => {
  try {
    await apolloServer.start();
    await mongoose.connect(mongoUri);
    app.use(
      '/graphql',
      cors(),
      express.json(),
      expressMiddleware(apolloServer, {
        context: async (ctx: ExpressContextFunctionArgument) => ({
          ...ctx,
          ...(await checkAuth(ctx.req))
        })
      })
    );
  } catch (error) {
    console.error('❌ Error starting server:', error);
  }
})();

httpServer.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}/graphql`);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}/subscriptions`);
});
