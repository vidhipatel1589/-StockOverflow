from cryptography.fernet import Fernet

# Generate a key and print it
key = Fernet.generate_key()
print(key.decode())  # Decode the key to make it readable (Base64 string)
