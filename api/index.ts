import app from '../src/app';

// Ensure we explicitly return an HTTP request handler
export default function handler(req: any, res: any) {
  return app(req, res);
}
