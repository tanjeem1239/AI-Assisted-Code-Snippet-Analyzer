import React, { useState } from 'react';

interface Props {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}

export const CodeInput: React.FC<Props> = ({ value, onChange, disabled }) => {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;
    setCode(newValue);
    setError(newValue.trim() === '' ? 'Code input cannot be empty' : null);
    onChange(newValue);
  };

  return (
    <div>
      <textarea
        placeholder="Paste JavaScript/TypeScript code..."
        value={code}
        onChange={handleChange}
        rows={14}
        style={{ width: '100%', fontFamily: 'monospace' }}
      />
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};