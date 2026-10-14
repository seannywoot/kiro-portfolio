import { handle } from "hono/vercel";
import { app } from "../server/src/app";

// Export standard HTTP handlers for Vercel Serverless Functions
export const GET = handle(app);
export const POST = handle(app);
export const OPTIONS = handle(app);

export default handle(app);
