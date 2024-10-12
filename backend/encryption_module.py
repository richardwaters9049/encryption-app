from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes


def encrypt_message(message: bytes, key: bytes):
    cipher = AES.new(key, AES.MODE_GCM)
    nonce = cipher.nonce
    ciphertext, tag = cipher.encrypt_and_digest(message)
    return nonce, ciphertext, tag


def decrypt_message(ciphertext: bytes, key: bytes, nonce: bytes, tag: bytes):
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    decrypted_message = cipher.decrypt_and_verify(ciphertext, tag)
    return decrypted_message
