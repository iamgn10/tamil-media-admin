"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const generateServiceFile = (ServiceName) => {
    const serviceContent = `
import { injectable, inject } from "tsyringe";
import { ${ServiceName}Repository } from "../repositories/${ServiceName.toLowerCase()}.repository";
import { I${ServiceName} } from "../models/${ServiceName.toLowerCase()}.model";

@injectable()
export class ${ServiceName}Service {

    constructor(@inject(${ServiceName}Repository) private ${ServiceName.toLowerCase()}Repository: ${ServiceName}Repository) {}

    async create${ServiceName}(${ServiceName.toLowerCase()}Data: Partial<I${ServiceName}>): Promise<I${ServiceName}> {
        return await this.${ServiceName.toLowerCase()}Repository.create${ServiceName}(${ServiceName.toLowerCase()}Data);
    }

    async getAll${ServiceName}s(): Promise<I${ServiceName}[]> {
        return await this.${ServiceName.toLowerCase()}Repository.getAll${ServiceName}s();
    }
    
    async find${ServiceName}ById(${ServiceName.toLowerCase()}Id: string): Promise<I${ServiceName} | null> {
        return await this.${ServiceName.toLowerCase()}Repository.find${ServiceName}ById(${ServiceName.toLowerCase()}Id);
    }
    
    async update${ServiceName}(${ServiceName.toLowerCase()}Id: string, updateData: Partial<I${ServiceName}>): Promise<I${ServiceName} | null> {
        return await this.${ServiceName.toLowerCase()}Repository.update${ServiceName}(${ServiceName.toLowerCase()}Id, updateData);
    }
    
    async delete${ServiceName}(${ServiceName.toLowerCase()}Id: string): Promise<boolean> {
        return await this.${ServiceName.toLowerCase()}Repository.delete${ServiceName}(${ServiceName.toLowerCase()}Id);
    }
}`;
    // Define the file path
    const filePath = path_1.default.join(__dirname, `../../services/${ServiceName.toLowerCase()}.service.ts`);
    // Write the file
    fs_1.default.writeFileSync(filePath, serviceContent.trim());
    console.log(`✅ ${ServiceName} service generated successfully at: ${filePath}`);
};
// Get the service name from the command line
const serviceName = process.argv[2];
if (!serviceName) {
    console.error("⚠️ Please provide a service name. Usage: npm run make:service <ServiceName>");
    process.exit(1);
}
// Generate the service file
generateServiceFile(serviceName);
// =======================developed by Sajith==========================================//
