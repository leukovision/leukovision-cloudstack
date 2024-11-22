import { customAlphabet } from "nanoid";

// Konfigurasi NanoID
const alphabet = "0123456789abcdefghijklmnopqrstuvwxyz";
const generateId = customAlphabet(alphabet, 12); // Panjang 12 karakter

export const createUserId = () => `usr_${generateId()}`;
