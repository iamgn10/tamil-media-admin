"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CloudflareR2Config = void 0;
exports.CloudflareR2Config = {
    bucketName: process.env.CLOUDFLARE_BUCKET_NAME,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY,
    endpoint: process.env.CLOUDFLARE_ENDPOINT,
    publicBaseUrl: process.env.CLOUDFLARE_PUBLIC_BASE_URL
};
