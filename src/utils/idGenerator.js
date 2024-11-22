import { customAlphabet } from "nanoid";

// Konfigurasi NanoID
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const generateId = customAlphabet(alphabet, 12);

// Generate User ID
export const createUserId = () => `usr_${generateId()}`;

// Generate Patient ID
export const createPatientId = () => `pt_${generateId()}`;
