import { getRequestListener } from "@hono/node-server";
import { app } from "../server/src/app";

// Tell Vercel's Node.js runtime not to parse the request body
// so Hono gets the raw incoming stream intact.
export const config = {
  api: {
    bodyParser: false,
  },
};

// Export Node.js HTTP request listener for Vercel Serverless Functions
export default getRequestListener(app.fetch);
