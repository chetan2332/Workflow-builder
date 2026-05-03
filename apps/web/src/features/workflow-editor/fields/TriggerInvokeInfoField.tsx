import { useState } from 'react';
import type { FieldProps } from './types';

export function TriggerInvokeInfoField({ field }: FieldProps) {
  const [copied, setCopied] = useState(false);
  const [showCurl, setShowCurl] = useState(false);

  // For now, show placeholder - in real implementation, would get workflowId and apiBaseUrl from context
  const method = 'POST';
  const baseUrl = 'https://api.example.com/workflows/[WORKFLOW-ID]/run';

  const curlExample = `curl -X POST \\
  ${baseUrl} \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"key": "value"}'`;

  const handleCopy = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <label className="label-sm">{field.label}</label>

      <div className="border border-slate-700 rounded-lg p-3 bg-slate-900/30 space-y-3">
        {/* Method and URL */}
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-xs font-semibold rounded bg-green-600/20 text-green-400 border border-green-600/30">
            {method}
          </span>
          <code className="flex-1 text-xs font-mono text-slate-300">
            {baseUrl}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="btn-ghost px-2 py-1 text-xs"
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>

        {/* Authentication note */}
        <div className="flex items-start gap-2 text-xs">
          <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-slate-400">
            Authentication required: Bearer token
          </span>
        </div>

        {/* Curl example (expandable) */}
        <div className="border-t border-slate-700/50 pt-2">
          <button
            type="button"
            onClick={() => setShowCurl(!showCurl)}
            className="text-xs text-slate-400 hover:text-slate-300 flex items-center gap-1"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showCurl ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showCurl ? 'Hide' : 'Show'} curl example
          </button>

          {showCurl && (
            <pre className="mt-2 p-2 bg-slate-950/50 rounded text-xs font-mono text-slate-300 overflow-x-auto border border-slate-700/30">
              {curlExample}
            </pre>
          )}
        </div>
      </div>

      <p className="text-xs text-slate-500">
        HTTP endpoint to trigger this workflow via API
      </p>
    </div>
  );
}
