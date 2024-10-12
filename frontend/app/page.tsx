"use client"; // Indicate this component uses client-side rendering

import { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button'; // Adjust the path as necessary
import { Input } from '../components/ui/input'; // Adjust the path as necessary
import { Toaster } from '../components/ui/toaster'; // Import the Toaster component
import { toast } from '../hooks/use-toast';

export default function Home() {
  const [message, setMessage] = useState('');
  const [key, setKey] = useState('');
  const [nonce, setNonce] = useState('');
  const [ciphertext, setCiphertext] = useState('');
  const [tag, setTag] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  const [error, setError] = useState('');
  const [showDecryption, setShowDecryption] = useState(false);
  const [decryptionSuccessful, setDecryptionSuccessful] = useState(false);

  const decryptionRef = useRef<HTMLDivElement>(null);
  const refreshButtonRef = useRef<HTMLButtonElement>(null);

  const handleEncrypt = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/encrypt`, {
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
        setShowDecryption(true);
        setError('');
        setDecryptionSuccessful(false);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Failed to communicate with the server');
    }
  };

  const handleDecrypt = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/decrypt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ciphertext, key, nonce, tag }),
      });

      const data = await response.json();
      if (response.ok) {
        setDecryptedMessage(data.message);
        setError('');
        setDecryptionSuccessful(true);
        refreshButtonRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setError(data.error);
        setDecryptionSuccessful(false);
      }
    } catch (err) {
      setError('Failed to communicate with the server');
    }
  };

  const handleReset = () => {
    setMessage('');
    setKey('');
    setNonce('');
    setCiphertext('');
    setTag('');
    setDecryptedMessage('');
    setError('');
    setShowDecryption(false);
    setDecryptionSuccessful(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({ title: `${label} copied to clipboard!`, duration: 2000 });
    }).catch(() => {
      toast({ title: 'Failed to copy!', duration: 2000 });
    });
  };

  useEffect(() => {
    if (showDecryption && decryptionRef.current) {
      decryptionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showDecryption]);

  useEffect(() => {
    if (decryptionSuccessful && refreshButtonRef.current) {
      refreshButtonRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [decryptionSuccessful]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 tracking-widest gap-4">
      <Toaster />
      <h1 className="text-4xl font-bold mb-6">AES Encryption & Decryption App</h1>

      <p className="mb-4 text-center w-1/2 text-lg">
        This application allows you to encrypt and decrypt messages using AES encryption.
      </p>

      <h2 className="text-lg font-bold mb-2">Click on the following buttons to copy this data for testing:</h2>
      <p className="mb-2">
        Message:
        <span className="text-blue-500 cursor-pointer hover:underline px-2" onClick={() => copyToClipboard("Hello, World!", "Message")}>
          <strong>Hello, World!</strong>
        </span>
        <br />
        Key:
        <span className="text-blue-500 cursor-pointer hover:underline px-2" onClick={() => copyToClipboard("thisisasecretkey", "Key")}>
          <strong>thisisasecretkey</strong>
        </span>
      </p>

      <div className="w-1/2 p-6 bg-white rounded-lg shadow-lg">
        <Input
          type="text"
          placeholder="Message"
          className="mb-4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Key (16, 24, or 32 characters)"
          className="mb-4"
          value={key}
          onChange={(e) => setKey(e.target.value)}
        />
        <Button onClick={handleEncrypt} className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-700">
          Encrypt
        </Button>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {showDecryption && (
          <div ref={decryptionRef} className="mt-6 flex flex-col gap-4">
            <h3 className="text-lg font-bold">Encryption Result:</h3>
            <p><strong>Nonce:</strong> {nonce}</p>
            <p><strong>Ciphertext:</strong> {ciphertext}</p>
            <p><strong>Tag:</strong> {tag}</p>

            <h2 className="text-2xl font-bold mt-8">Decrypt a Message</h2>
            <Input
              type="text"
              placeholder="Nonce"
              className="mb-4"
              value={nonce}
              onChange={(e) => setNonce(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Ciphertext"
              className="mb-4"
              value={ciphertext}
              onChange={(e) => setCiphertext(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Tag"
              className="mb-4"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Key (16, 24, or 32 characters)"
              className="mb-4"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <Button onClick={handleDecrypt} className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700">
              Decrypt
            </Button>

            {decryptedMessage && (
              <div className="mt-6 flex flex-col gap-4">
                <h3 className="text-lg font-bold">Decryption Result</h3>
                <p><strong>Decrypted Message:</strong> {decryptedMessage}</p>
              </div>
            )}

            {decryptionSuccessful && (
              <Button ref={refreshButtonRef} onClick={handleReset} className="mt-4 w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-700">
                Refresh
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
