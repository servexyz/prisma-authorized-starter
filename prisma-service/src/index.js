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
    allPublicRoutes: (parent, args, ctx, info) => {
      const where = { public: true };
      return ctx.db.query.routes({ where }, info);
    },
    isRouteAuthorized: async (parent, { routeId, userId }, ctx, info) => {
      console.log(`Parameters: ${routeId} & ${userId}`);
      const whereRoute = { id: routeId };
      let route = await ctx.db.query.route(
        { where: whereRoute },
        `{ id, path, public }`
      );
      const whereUser = { id: userId };
      let user = await ctx.db.query.user(
        { where: whereUser },
        `{id, username, jwt}`
      );
      return { data: user, route };
    }
  },
  Mutation: {
    //First, get user/pass. Note: aws-sls-auther will need to flex b/w online & offline
    authenticate: async (parent, { username, password }, ctx, info) => {
      //Grab token, which we will use in mutation
      let jwt = await authenticate(username, password);

      //Define condition for querying all users with specific username
      //Username should be unique. Assumption I'm making here is username==email
      const whereUsername = username ? { username } : {};

      //Grab id field from all users which have username (hopefully only 1)
      let userId = await ctx.db.query.users({ where: whereUsername }, `{ id }`);

      //Update the first user ID with JWT
      //TODO: add checking here to ensure there's only one returned user IDA
      const where = { id: userId[0].id };
      console.log(`jwt: ${jwt}`);

      //Creating this variable for visual consistency. Not necessary.
      const data = { jwt };

      //Finally, we update our user with the JWT received earlier
      return ctx.db.mutation.updateUser({ where, data }, info);
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

server.start(() => {
  process.env.AUTHER_ENDPOINT = "http://localhost:3000/api";
  console.log(`Prisma-starter running => http://localhost:4000`);
});
