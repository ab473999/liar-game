import { useState } from 'react'
import { Loader2, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useThemes, useWords } from '@/hooks/useApi'

export const AdminPanel = () => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const { themes, loading: themesLoading, error: themesError, refetch: refetchThemes } = useThemes()
  const { words, loading: wordsLoading, error: wordsError } = useWords(selectedTheme)

  // Test environment variables
  const apiUrl = import.meta.env.VITE_API_URL
  const appVersion = import.meta.env.VITE_APP_VERSION

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          Admin Panel - API Testing
        </h1>
        
        <div className="mb-8 p-4 bg-gray-800 rounded-lg">
          <p className="text-sm text-gray-400 mb-2">Version: {appVersion || 'dev'}</p>
          <p className="text-sm text-gray-400">API: {apiUrl || 'not configured'}</p>
        </div>
      </div>

      {/* Phase 1 Status */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-400" />
          Phase 1: Setup Complete
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>✓ Vite configured</div>
          <div>✓ TypeScript ready</div>
          <div>✓ Tailwind CSS integrated</div>
          <div>✓ Path aliases configured</div>
          <div>✓ Environment variables</div>
          <div>✓ System fonts applied</div>
        </div>
      </div>

      {/* Phase 2 Status */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl mb-4 flex items-center gap-2">
          <CheckCircle className="text-green-400" />
          Phase 2: Core Infrastructure Complete
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
          <div>✓ TypeScript types defined</div>
          <div>✓ API service created</div>
          <div>✓ API hooks implemented</div>
          <div>✓ CORS configuration fixed</div>
        </div>
      </div>

      {/* API Testing */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl mb-6 text-yellow-400">
          API Integration Testing
        </h2>

        {/* Themes Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Themes from API</h3>
            <button
              onClick={refetchThemes}
              className="p-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              disabled={themesLoading}
            >
              <RefreshCw className={`w-5 h-5 ${themesLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {themesLoading && (
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading themes...</span>
            </div>
          )}

          {themesError && (
            <div className="flex items-center gap-2 text-red-400 mb-4">
              <AlertCircle className="w-5 h-5" />
              <span>Error: {themesError}</span>
            </div>
          )}

          {!themesLoading && !themesError && themes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedTheme === theme.type
                      ? 'bg-blue-600 border-blue-400'
                      : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                  }`}
                >
                  <div className="font-semibold">{theme.nameEn}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Type: {theme.type}
                  </div>
                </button>
              ))}
            </div>
          )}

          {!themesLoading && themes.length === 0 && !themesError && (
            <p className="text-gray-500">No themes found</p>
          )}
        </div>

        {/* Words Section */}
        {selectedTheme && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Words for "{selectedTheme}"
            </h3>

            {wordsLoading && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Loading words...</span>
              </div>
            )}

            {wordsError && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-5 h-5" />
                <span>Error: {wordsError}</span>
              </div>
            )}

            {!wordsLoading && !wordsError && words.length > 0 && (
              <div className="bg-gray-700 rounded-lg p-4 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {words.map((word) => (
                    <div
                      key={word.id}
                      className="px-3 py-2 bg-gray-600 rounded text-sm"
                    >
                      {word.word}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">
                  Total: {words.length} words
                </p>
              </div>
            )}

            {!wordsLoading && words.length === 0 && !wordsError && (
              <p className="text-gray-500">No words found for this theme</p>
            )}
          </div>
        )}
      </div>

      {/* API Response Stats */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-400 mb-2">API Stats</h3>
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>Themes loaded: {themes.length}</div>
          <div>Selected theme: {selectedTheme || 'None'}</div>
          <div>Words loaded: {words.length}</div>
          <div>API endpoint: {apiUrl}</div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-800 rounded-lg text-sm text-gray-500">
        <p>Progress Tracker:</p>
        <ul className="mt-2 space-y-1">
          <li>✅ Phase 1: Project Setup</li>
          <li>✅ Phase 2: Core Infrastructure</li>
          <li className="text-yellow-400">🚧 Phase 3: Component Migration</li>
          <li className="text-gray-600">⏳ Phase 4: Page Implementation</li>
          <li className="text-gray-600">⏳ Phase 5: Feature Parity</li>
        </ul>
      </div>
    </div>
  )
}
