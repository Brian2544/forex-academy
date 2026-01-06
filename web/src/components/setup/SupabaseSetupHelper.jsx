import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Copy, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const SupabaseSetupHelper = ({ onDismiss }) => {
  const [step, setStep] = useState(1);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const envTemplate = `VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
VITE_API_BASE_URL=http://localhost:5000/api`;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Supabase Setup Required</h2>
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Step 1: Get Supabase Credentials */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Get Your Supabase Credentials</h3>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm">
                    <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                        supabase.com <ExternalLink className="w-3 h-3" />
                      </a> and sign in (or create a free account)
                    </li>
                    <li>Create a new project (or use an existing one)</li>
                    <li>Go to <strong>Settings</strong> → <strong>API</strong></li>
                    <li>Copy these two values:
                      <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                        <li><strong>Project URL</strong> (looks like: https://xxxxx.supabase.co)</li>
                        <li><strong>anon public key</strong> (long string starting with eyJ...)</li>
                      </ul>
                    </li>
                  </ol>
                  <div className="mt-4">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      I have my credentials →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Create .env file */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Create .env File</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    In the <code className="bg-gray-100 px-2 py-1 rounded">web</code> directory, create a file named <code className="bg-gray-100 px-2 py-1 rounded">.env</code>
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">.env file content:</span>
                      <button
                        onClick={() => copyToClipboard(envTemplate)}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="text-xs bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                      <code>{envTemplate}</code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <strong>Important:</strong> Replace <code>YOUR_PROJECT</code> and <code>YOUR_ANON_KEY</code> with your actual values from Step 1.
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">How to create the file:</p>
                    <div className="bg-gray-50 rounded-lg p-3 text-sm">
                      <p className="font-mono text-gray-800">
                        <strong>Windows:</strong> Open Notepad, paste the content, save as <code>.env</code> (not .env.txt)<br />
                        <strong>Mac/Linux:</strong> Run: <code>nano web/.env</code> or use any text editor
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => setStep(3)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      I created the file →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Restart */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">Restart the Dev Server</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    After creating the <code className="bg-gray-100 px-2 py-1 rounded">.env</code> file, you need to restart the development server for the changes to take effect.
                  </p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">In your terminal:</p>
                    <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
                      <li>Stop the current server (press <code className="bg-white px-1 rounded">Ctrl+C</code>)</li>
                      <li>Run: <code className="bg-white px-2 py-1 rounded">npm run dev</code></li>
                    </ol>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-green-800">
                        <strong>Done!</strong> After restarting, try logging in again. The error should be gone.
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setStep(2)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={onDismiss}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Got it!
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupabaseSetupHelper;

