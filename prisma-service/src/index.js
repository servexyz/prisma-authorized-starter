import { GraphQLServer } from "graphql-yoga";
import { PRISMA_ENDPOINT } from "babel-dotenv";
import { Prisma } from "prisma-binding";
import { authenticate, isAuthorized } from "aws-sls-auther";

//TODO: Create resolvers directory with lazy loading index / spread
const resolvers = {
  Query: {
    allFoos: (parent, { name }, ctx, info) => {
      const where = name
        ? {
            name_contains: name
          }
        : {};
      return ctx.db.query.foos({ where }, info);
    },
    allRoutes: (parent, { type }, ctx, info) => {
      const where = type ? { type_contains: type } : {};
      return ctx.db.query.routes({ where }, info);
    },
    authenticate: (parent, { username, password }, ctx, info) => {
      let user = `Username: ${username}\n Password: ${password}`;
      console.log(`user: ${user}`);
      return { data: { user } };
    },
    isAuthorized: (parent, { route }, ctx, info) => {
      console.log(`Route: ${route}`);
      return { data: { route } };
    }
  }
};

//TODO: Replace all endpoints with env variables
const server = new GraphQLServer({
  typeDefs: "src/schema.graphql",
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: "src/generated/prisma.graphql", // the auto-generated GraphQL schema of the Prisma API
      endpoint: PRISMA_ENDPOINT, // the endpoint of the Prisma API
      debug: true // log all GraphQL queries & mutations sent to the Prisma API
      // secret: process.env.PRISMA_SECRET // only needed if specified in `database/prisma.yml`
    })
  })
});

server.start(() =>
  console.log(`Prisma-starter running => http://localhost:4000`)
);
