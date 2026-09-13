const HASH_PREFIX = "pbkdf2";
const ITERATIONS = 210000;
const KEY_LENGTH_BYTES = 32;

function bytesToBase64(bytes: Uint8Array) {
    let binary = "";
    bytes.forEach((byte) => {
        binary += String.fromCharCode(byte);
    });
    return btoa(binary);
}

function base64ToBytes(value: string) {
    const binary = atob(value);
    return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function timingSafeEqual(a: string, b: string) {
    const aBytes = new TextEncoder().encode(a);
    const bBytes = new TextEncoder().encode(b);
    if (aBytes.length !== bBytes.length) return false;

    let diff = 0;
    for (let i = 0; i < aBytes.length; i++) {
        diff |= aBytes[i] ^ bBytes[i];
    }
    return diff === 0;
}

async function derivePasswordHash(password: string, salt: Uint8Array) {
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(password),
        "PBKDF2",
        false,
        ["deriveBits"],
    );
    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            hash: "SHA-256",
            salt,
            iterations: ITERATIONS,
        },
        keyMaterial,
        KEY_LENGTH_BYTES * 8,
    );

    return bytesToBase64(new Uint8Array(bits));
}

export function _passwordNeedsRehash(password: string) {
    return !password.startsWith(`${HASH_PREFIX}$`);
}

export async function _verifyPassword(password: string, storedPassword: string) {
    if (_passwordNeedsRehash(storedPassword)) {
        return password === _decodeLegacyPassword(storedPassword);
    }

    const [, iterations, salt, hash] = storedPassword.split("$");
    if (!iterations || !salt || !hash) return false;

    const derivedHash = await derivePasswordHash(password, base64ToBytes(salt));
    return timingSafeEqual(derivedHash, hash);
}

export function _decodeLegacyPassword(password: string) {
    const decodedPassword = atob(password);
    const length = decodedPassword.length;
    return decodedPassword.slice(length / 3, 2 * length / 3);
}

export async function _encodePassword(password: string) {
    const salt = new Uint8Array(16);
    crypto.getRandomValues(salt);
    const hash = await derivePasswordHash(password, salt);

    return `${HASH_PREFIX}$${ITERATIONS}$${bytesToBase64(salt)}$${hash}`;
}
