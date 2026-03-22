"use strict";
// utils/sanitizeFormData.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeFormData = void 0;
function sanitizeFormData(formData) {
    const result = {};
    for (const key in formData) {
        let value = formData[key];
        // Handle empty strings as undefined
        if (value === '') {
            continue; // skip setting
        }
        // Try to parse JSON strings (for arrays or objects)
        if (typeof value === 'string' && value.trim().startsWith('{') || value.trim().startsWith('[')) {
            try {
                value = JSON.parse(value);
            }
            catch {
                // If parse fails, keep original string
            }
        }
        // Normalize booleans
        if (value === 'true')
            value = true;
        else if (value === 'false')
            value = false;
        result[key] = value;
    }
    return result;
}
exports.sanitizeFormData = sanitizeFormData;
