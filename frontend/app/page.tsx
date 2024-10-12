"use client"

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [nonce, setNonce] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [tag, setTag] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');

  const handleEncrypt = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/encrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, key }),
      });

      const data = await response.json();
      if (response.ok) {
        setNonce(data.nonce);
        setCiphertext(data.ciphertext);
        setTag(data.tag);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to communicate with the server');
    }
  };

  const handleDecrypt = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5001/decrypt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ciphertext,
          key,
          nonce,
          tag,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setDecryptedMessage(data.message);
        setError('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to communicate with the server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-6">AES Encryption & Decryption App</h1>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        {/* Encryption Form */}
        <input
          type="text"
          placeholder="Message"
          className="w-full p-2 mb-4 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <input
          type="text"
          placeholder="Key (16, 24, or 32 characters)"
          className="w-full p-2 mb-4 border rounded"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          onClick={handleEncrypt}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700"
        >
          Encrypt
        </button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {ciphertext && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Encryption Result:</h3>
            <p><strong>Nonce:</strong> {nonce}</p>
            <p><strong>Ciphertext:</strong> {ciphertext}</p>
            <p><strong>Tag:</strong> {tag}</p>
          </div>
        )}

        {/* Decryption Form */}
        <h2 className="text-2xl font-bold mt-8">Decrypt a Message</h2>
        <input
          type="text"
          placeholder="Ciphertext"
          className="w-full p-2 mb-4 border rounded"
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nonce"
          className="w-full p-2 mb-4 border rounded"
          value={nonce}
          onChange={(e) => setNonce(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tag"
          className="w-full p-2 mb-4 border rounded"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <input
          type="text"
          placeholder="Key (16, 24, or 32 characters)"
          className="w-full p-2 mb-4 border rounded"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <button
          onClick={handleDecrypt}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700"
        >
          Decrypt
        </button>

        {decryptedMessage && (
          <div className="mt-6">
            <h3 className="text-lg font-bold">Decryption Result:</h3>
            <p><strong>Decrypted Message:</strong> {decryptedMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
