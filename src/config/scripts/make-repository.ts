import fs from 'fs';
import path from 'path';

const generateRepositoryFile = (RepositoryName: string) => {
    const repositoryContent = `
import ${RepositoryName}, {I${RepositoryName}} from "../models/${RepositoryName.toLowerCase()}.model";
import { I${RepositoryName}Repository } from "../types/repo/I${RepositoryName}Repository";
    
export class ${RepositoryName}Repository implements I${RepositoryName}Repository {
    
    async create${RepositoryName}(${RepositoryName.toLowerCase()}Data: Partial<I${RepositoryName}>): Promise<I${RepositoryName}> {
        return await ${RepositoryName}.create(${RepositoryName.toLowerCase()}Data);
    }

    async getAll${RepositoryName}s(): Promise<I${RepositoryName}[]> {
        return await ${RepositoryName}.find();
    }

    async find${RepositoryName}ById(${RepositoryName.toLowerCase()}Id: string): Promise<I${RepositoryName} | null> {
        return await ${RepositoryName}.findById(${RepositoryName.toLowerCase()}Id);
    }

    async update${RepositoryName}(${RepositoryName.toLowerCase()}Id: string, updateData: Partial<I${RepositoryName}>): Promise<I${RepositoryName} | null> {
        
        return await ${RepositoryName}.findByIdAndUpdate(${RepositoryName.toLowerCase()}Id, updateData, { new: true });
            
    }   

    async delete${RepositoryName}(${RepositoryName.toLowerCase()}Id: string): Promise<boolean> {
        // const ${RepositoryName.toLowerCase()} = await this.findUserById(${RepositoryName.toLowerCase()}Id);
        // if (!${RepositoryName.toLowerCase()}) return false;
        // await ${RepositoryName.toLowerCase()}.deleteOne();
        // return true;

        const result = await ${RepositoryName}.findByIdAndDelete(${RepositoryName.toLowerCase()}Id);
        return result !== null;
    }
}`;

// Define the file path
  const filePath = path.join(__dirname, `../../repositories/${RepositoryName.toLowerCase()}.repository.ts`);

  // Write the file
  fs.writeFileSync(filePath, repositoryContent.trim());

  console.log(`✅ ${RepositoryName} repository generated successfully at: ${filePath}`);
}

const generateRepositoryInterfaceFile = (RepositoryName: string) => {
    const repositoryInterfaceContent = `
import { I${RepositoryName} } from "../../models/${RepositoryName.toLowerCase()}.model";
        
export interface I${RepositoryName}Repository {
    create${RepositoryName}(${RepositoryName.toLowerCase()}: Partial<I${RepositoryName}>): Promise<I${RepositoryName}>;
    getAll${RepositoryName}s(): Promise<I${RepositoryName}[]>;
    find${RepositoryName}ById(${RepositoryName.toLowerCase()}Id: string): Promise<I${RepositoryName} | null>;
    update${RepositoryName}(${RepositoryName.toLowerCase()}Id: string, updateData: Partial<I${RepositoryName}>): Promise<I${RepositoryName} | null>;
    delete${RepositoryName}(${RepositoryName.toLowerCase()}Id: string): Promise<boolean>;
}`;

// Define the file path
  const filePath = path.join(__dirname, `../../types/repo/I${RepositoryName}Repository.ts`);

  // Write the file
  fs.writeFileSync(filePath, repositoryInterfaceContent.trim());

  console.log(`✅ ${RepositoryName} repository Interface generated successfully at: ${filePath}`);
}


const repositoryName = process.argv[2];
if (!repositoryName) {
  console.error("⚠️ Please provide a repository name. Usage: npm run make:repo <RepositoryName>");
  process.exit(1);
}

// Generate the repository file
generateRepositoryFile(repositoryName);
generateRepositoryInterfaceFile(repositoryName);

// =======================developed by Sajith==========================================//