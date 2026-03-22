import connectDB from '../src/config/database';
import app from '../src/app';

// Ensure the database is connected before handling the request
export default async function handler(req: any, res: any) {
  await connectDB();
  return app(req, res);
}
