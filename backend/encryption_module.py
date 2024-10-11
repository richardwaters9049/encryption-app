from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes


def encrypt_message(message: bytes, key: bytes) -> tuple:
    """
    Encrypts a message using AES encryption.
    :param message: The plaintext message to be encrypted.
    :param key: The secret key for encryption (must be 16, 24, or 32 bytes).
    :return: A tuple (nonce, ciphertext, tag).
    """
    cipher = AES.new(key, AES.MODE_GCM)
    ciphertext, tag = cipher.encrypt_and_digest(message)
    return cipher.nonce, ciphertext, tag


def decrypt_message(nonce: bytes, ciphertext: bytes, tag: bytes, key: bytes) -> bytes:
    """
    Decrypts an encrypted message using AES decryption.
    :param nonce: The random nonce used during encryption.
    :param ciphertext: The encrypted message.
    :param tag: The authentication tag for message integrity.
    :param key: The secret key for decryption.
    :return: The decrypted message (plaintext).
    """
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    message = cipher.decrypt_and_verify(ciphertext, tag)
    return message
