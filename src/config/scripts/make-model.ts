import * as fs from "fs/promises";
import * as path from "path";

const args = process.argv.slice(2);
const capitalizeFirstLetter = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const modelName = capitalizeFirstLetter(args[0]);

if (!modelName) {
  console.error("❌ Please provide a model name.");
  process.exit(1);
}

console.log(`Model Name: ${modelName}`);

// Directories
const modelsDir = path.join(process.cwd(), "src", "models");
const modelFilePath = path.join(
  modelsDir,
  `${modelName.toLowerCase()}.model.ts`
);
const relativeModelFilePath = path.relative(process.cwd(), modelFilePath);

// Template
const modelTemplate = `import mongoose, { Schema, Document } from 'mongoose';

export interface I${modelName} extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const ${modelName}Schema = new Schema<I${modelName}>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
);

export const ${modelName} = mongoose.model<I${modelName}>('${modelName}', ${modelName}Schema);
export default ${modelName};
`;

(async () => {
  try {
    // Ensure the directory exists
    await fs.mkdir(modelsDir, { recursive: true });

    // Check if file already exists
    const exists = await fs
      .access(modelFilePath)
      .then(() => true)
      .catch(() => false);

    if (exists) {
      console.log(`⚠️  Model "${modelName}" already exists.`);
      process.exit(0);
    }

    // Write model file
    await fs.writeFile(modelFilePath, modelTemplate);
    console.log(`✅ ${modelName} model created successfully. < ${relativeModelFilePath} >`);
  } catch (err) {
    console.error("❌ Error creating model:", err);
  }
})();
