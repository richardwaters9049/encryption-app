import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from encryption_module import encrypt_message, decrypt_message

app = Flask(__name__)
CORS(app)


@app.route("/encrypt", methods=["POST"])
def encrypt():
    try:
        data = request.json

        # Validate request data
        if not data or "message" not in data or "key" not in data:
            return (
                jsonify(
                    {
                        "error": 'Invalid request. "message" and "key" fields are required.'
                    }
                ),
                400,
            )

        message = data["message"].encode("utf-8")
        key = data["key"].encode("utf-8")

        # Validate key length
        if len(key) not in [16, 24, 32]:
            return (
                jsonify(
                    {
                        "error": "Invalid key length. Key must be 16, 24, or 32 bytes long."
                    }
                ),
                400,
            )

        # Encrypt the message
        nonce, ciphertext, tag = encrypt_message(message, key)
        return jsonify(
            {"nonce": nonce.hex(), "ciphertext": ciphertext.hex(), "tag": tag.hex()}
        )
    except Exception as e:
        print("Error during encryption:", str(e))
        return jsonify({"error": str(e)}), 400


@app.route("/decrypt", methods=["POST"])
def decrypt():
    try:
        data = request.json

        # Validate request data
        if (
            not data
            or "ciphertext" not in data
            or "key" not in data
            or "nonce" not in data
            or "tag" not in data
        ):
            return (
                jsonify(
                    {
                        "error": 'Invalid request. "ciphertext", "key", "nonce", and "tag" fields are required.'
                    }
                ),
                400,
            )

        # Decode request data
        ciphertext = bytes.fromhex(data["ciphertext"])
        key = data["key"].encode("utf-8")
        nonce = bytes.fromhex(data["nonce"])
        tag = bytes.fromhex(data["tag"])

        # Validate key length
        if len(key) not in [16, 24, 32]:
            return (
                jsonify(
                    {
                        "error": "Invalid key length. Key must be 16, 24, or 32 bytes long."
                    }
                ),
                400,
            )

        # Decrypt the message
        decrypted_message = decrypt_message(ciphertext, key, nonce, tag)
        return jsonify({"message": decrypted_message.decode("utf-8")})
    except Exception as e:
        print("Error during decryption:", str(e))
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    # Use the PORT environment variable if it exists, otherwise default to 5001
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port, debug=True)
