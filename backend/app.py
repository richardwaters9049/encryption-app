from flask import Flask, request, jsonify
from encryption_module import encrypt_message, decrypt_message

app = Flask(__name__)


@app.route("/encrypt", methods=["POST"])
def encrypt():
    """
    API endpoint for encryption. Accepts a POST request with 'message' and 'key',
    and returns the encrypted data (nonce, ciphertext, tag).
    """
    try:
        data = request.json
        message = data["message"].encode("utf-8")
        key = data["key"].encode("utf-8")
        nonce, ciphertext, tag = encrypt_message(message, key)
        return jsonify(
            {"nonce": nonce.hex(), "ciphertext": ciphertext.hex(), "tag": tag.hex()}
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@app.route("/decrypt", methods=["POST"])
def decrypt():
    """
    API endpoint for decryption. Accepts a POST request with 'ciphertext', 'nonce', 'tag', and 'key',
    and returns the decrypted message.
    """
    try:
        data = request.json
        nonce = bytes.fromhex(data["nonce"])
        ciphertext = bytes.fromhex(data["ciphertext"])
        tag = bytes.fromhex(data["tag"])
        key = data["key"].encode("utf-8")
        message = decrypt_message(nonce, ciphertext, tag, key)
        return jsonify({"message": message.decode("utf-8")})
    except Exception as e:
        return jsonify({"error": str(e)}), 400


if __name__ == "__main__":
    app.run(debug=True)
