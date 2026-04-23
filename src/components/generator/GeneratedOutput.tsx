import React, { useState } from 'react';
import { formatMediaName } from '../../utils/formatters';
import Button from '../common/Button';
import { useClipboard } from '../../hooks/useClipboard';
import type { SubtaskOutput } from '../../types/subtask.types';

interface GeneratedOutputProps {
  data: SubtaskOutput[];
  onReset: () => void;
}

interface FieldDisplay {
  label: string;
  value: string;
}

const GeneratedOutput: React.FC<GeneratedOutputProps> = ({ data, onReset }) => {
  const { copyToClipboard, copied } = useClipboard();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const buildFields = (entry: SubtaskOutput): FieldDisplay[] => [
    { label: 'Body Script ID', value: entry.bsid },
    { label: 'Body Visual ID', value: entry.bvid },
    { label: 'Hook Script ID', value: entry.hsid },
    { label: 'Hook Visual ID', value: entry.hvid }
  ];

  const handleCopy = async (text: string, key: string): Promise<void> => {
    setCopiedKey(key);
    await copyToClipboard(text);
  };

  return (
    <div className="space-y-6">
      {data.map((entry, index) => {
        const fields = buildFields(entry);
        const mediaName = formatMediaName(entry);

        return (
          <div key={`${entry.bsid}-${entry.bvid}-${index}`} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Generated IDs #{index + 1}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields.map((field) => (
                <div
                  key={field.label}
                  className="bg-white p-4 rounded-lg border border-gray-100"
                >
                  <p className="text-sm text-gray-500 mb-1">{field.label}</p>
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-mono text-lg font-semibold text-gray-900 break-all">
                      {field.value}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleCopy(field.value, `${index}-${field.label}`)}
                      className="p-2 rounded-md border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-colors"
                      aria-label={`Copy ${field.label}`}
                      title={`Copy ${field.label}`}
                    >
                      {copied && copiedKey === `${index}-${field.label}` ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm14.28-2.03a.75.75 0 0 0-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.5-5.5Z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                          <path d="M8.25 7.5a2.25 2.25 0 0 0-2.25 2.25v8.25a2.25 2.25 0 0 0 2.25 2.25h8.25a2.25 2.25 0 0 0 2.25-2.25V9.75a2.25 2.25 0 0 0-2.25-2.25H8.25Z" />
                          <path d="M5.25 15a.75.75 0 0 1-.75-.75V6.75A2.25 2.25 0 0 1 6.75 4.5h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 0 6 6.75v7.5a.75.75 0 0 1-.75.75Z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-black text-white rounded-lg p-4">
              <p className="text-sm font-semibold mb-2">Media Name Format</p>
              <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-sm break-all">{mediaName}</p>
                <button
                  type="button"
                  onClick={() => handleCopy(mediaName, `${index}-media`)}
                  className="p-2 rounded-md border border-white/30 text-white hover:bg-white/10 transition-colors"
                  aria-label="Copy Media Name"
                  title="Copy Media Name"
                >
                  {copied && copiedKey === `${index}-media` ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path fillRule="evenodd" d="M2.25 12a9.75 9.75 0 1 1 19.5 0 9.75 9.75 0 0 1-19.5 0Zm14.28-2.03a.75.75 0 0 0-1.06-1.06l-4.97 4.97-1.97-1.97a.75.75 0 1 0-1.06 1.06l2.5 2.5a.75.75 0 0 0 1.06 0l5.5-5.5Z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M8.25 7.5a2.25 2.25 0 0 0-2.25 2.25v8.25a2.25 2.25 0 0 0 2.25 2.25h8.25a2.25 2.25 0 0 0 2.25-2.25V9.75a2.25 2.25 0 0 0-2.25-2.25H8.25Z" />
                      <path d="M5.25 15a.75.75 0 0 1-.75-.75V6.75A2.25 2.25 0 0 1 6.75 4.5h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 0 6 6.75v7.5a.75.75 0 0 1-.75.75Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        );
      })}

      <div className="flex">
        <Button onClick={onReset} variant="primary">
          Generate New
        </Button>
      </div>
    </div>
  );
};

export default GeneratedOutput;