import os
import hashlib
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from django.conf import settings

# Get Key from settings
# Ensure key is 32 bytes for AES-256
def get_key():
    key_hex = settings.SECRET_KEY # Using SECRET_KEY or AES_KEY if available.
    # The prompt asked for specific AES key env var, let's use that.
    env_key = os.getenv('AES_KEY')
    if env_key:
        # If hex, decode. If string, hash it.
        try:
            return bytes.fromhex(env_key)
        except ValueError:
            return hashlib.sha256(env_key.encode()).digest()
    else:
        # Fallback to hashing SECRET_KEY
        return hashlib.sha256(settings.SECRET_KEY.encode()).digest()

def encrypt_data(data):
    """
    Encrypts bytes data using AES-256 CBC.
    Returns bytes: iv + encrypted_data
    """
    key = get_key()
    iv = os.urandom(16)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_data = cipher.encrypt(pad(data, AES.block_size))
    return iv + encrypted_data

def decrypt_data(encrypted_data_with_iv):
    """
    Decrypts bytes data using AES-256 CBC.
    Expects data to be iv + encrypted_data.
    """
    key = get_key()
    iv = encrypted_data_with_iv[:16]
    encrypted_data = encrypted_data_with_iv[16:]
    cipher = AES.new(key, AES.MODE_CBC, iv)
    try:
        data = unpad(cipher.decrypt(encrypted_data), AES.block_size)
        return data
    except ValueError:
        raise ValueError("Decryption failed. Invalid Key or Data.")
