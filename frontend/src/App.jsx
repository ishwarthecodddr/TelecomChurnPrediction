import { useState } from 'react'

function App() {
  const [tenure, setTenure] = useState('')
  const [monthlyCharges, setMonthlyCharges] = useState('')
  const [totalCharges, setTotalCharges] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pipelineStep, setPipelineStep] = useState(0)
  const [darkMode, setDarkMode] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const toggleTheme = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setDarkMode(!darkMode)
    }, 500)
    setTimeout(() => {
      setIsTransitioning(false)
    }, 1000)
  }

  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)
    
    setPipelineStep(1)
    await new Promise(r => setTimeout(r, 500))
    setPipelineStep(2)
    
    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenure: parseInt(tenure),
          MonthlyCharges: parseFloat(monthlyCharges),
          TotalCharges: parseFloat(totalCharges),
        }),
      })

      setPipelineStep(3)
      if (!response.ok) throw new Error('Prediction failed')
      
      await new Promise(r => setTimeout(r, 400))
      setPipelineStep(4)
      
      const data = await response.json()
      setResult(data.churn)
    } catch (err) {
      setError('Error connecting to server. Make sure backend is running.')
      setPipelineStep(0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'}`}>
      
      {/* Circular Transition Overlay - From Bottom Center using clip-path */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none will-change-[clip-path]"
        style={{
          clipPath: isTransitioning 
            ? 'circle(150% at 50% 100%)' 
            : 'circle(0% at 50% 100%)',
          transition: 'clip-path 0.8s ease-in-out',
          backgroundColor: darkMode ? '#f0f4ff' : '#111827',
        }}
      />

      {/* Header */}
      <header className={`relative z-10 shadow-sm border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto py-6 px-4 flex items-center justify-between">
          <div className="flex-1" />
          <div className="text-center">
            <h1 className={`text-3xl font-bold flex items-center justify-center gap-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <span className="text-4xl">📞</span> 
              Telecom Churn Prediction
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Machine Learning powered customer retention analysis</p>
          </div>
          
          {/* Toggle Button - Top Right */}
          <div className="flex-1 flex justify-end">
            <button
              onClick={toggleTheme}
              disabled={isTransitioning}
              className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-all duration-300 hover:scale-105 disabled:hover:scale-100 z-50
                ${darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' 
                  : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50'}`}
            >
              <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
              <span className="font-medium text-sm hidden sm:inline">{darkMode ? 'Light' : 'Dark'}</span>
              <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-300 ${darkMode ? 'translate-x-5' : 'translate-x-0'}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto p-6 md:p-8 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Left: Form Card */}
          <div className={`rounded-xl shadow-lg border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-indigo-900 text-indigo-400' : 'bg-indigo-100 text-indigo-600'}`}>📊</span>
              Enter Customer Data
            </h2>
            
            <form onSubmit={handlePredict} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Tenure (months)
                </label>
                <input
                  type="number"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  placeholder="e.g., 12"
                  required
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>How long has the customer been with us?</p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Monthly Charges ($)
                </label>
                <input
                  type="number"
                  value={monthlyCharges}
                  onChange={(e) => setMonthlyCharges(e.target.value)}
                  placeholder="e.g., 70.50"
                  required
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Current monthly bill amount</p>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Total Charges ($)
                </label>
                <input
                  type="number"
                  value={totalCharges}
                  onChange={(e) => setTotalCharges(e.target.value)}
                  placeholder="e.g., 1500.00"
                  required
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all
                    ${darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'}`}
                />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Total amount paid till date</p>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {loading ? '⏳ Processing...' : '🚀 Predict Churn'}
              </button>
            </form>

            {/* Result */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                result === 'Yes' 
                  ? 'bg-red-500/20 border-2 border-red-500 text-red-500' 
                  : 'bg-green-500/20 border-2 border-green-500 text-green-500'
              }`}>
                <p className="font-bold text-lg mb-1">
                  {result === 'Yes' ? '⚠️ Churn Risk: HIGH' : '✅ Churn Risk: LOW'}
                </p>
                <p className="text-sm opacity-90">
                  {result === 'Yes' 
                    ? 'This customer is likely to leave. Consider retention strategies!' 
                    : 'This customer is likely to stay. Keep up the good service!'}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-amber-500/20 border border-amber-500 rounded-lg text-amber-500 text-center text-sm">
                ⚠️ {error}
              </div>
            )}
          </div>

          {/* Right: How It Works */}
          <div className={`rounded-xl shadow-lg border p-6 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${darkMode ? 'bg-purple-900 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>⚙️</span>
              How It Works
            </h2>
            
            {/* Pipeline Steps */}
            <div className="space-y-3">
              {[
                { step: 1, icon: '📝', title: 'Data Collection', desc: 'Form inputs collected' },
                { step: 2, icon: '🌐', title: 'API Request', desc: 'POST /predict' },
                { step: 3, icon: '🤖', title: 'ML Prediction', desc: 'Random Forest model' },
                { step: 4, icon: '📊', title: 'Result', desc: 'JSON response' },
              ].map((item, idx) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg transition-all
                    ${pipelineStep >= item.step 
                      ? pipelineStep > item.step 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-indigo-500/20 text-indigo-500 animate-pulse' 
                      : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                    {pipelineStep > item.step ? '✓' : item.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${pipelineStep >= item.step ? (darkMode ? 'text-white' : 'text-gray-800') : (darkMode ? 'text-gray-500' : 'text-gray-400')}`}>
                      {item.title}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
                  </div>
                  {idx < 3 && <div className={darkMode ? 'text-gray-600' : 'text-gray-300'}>→</div>}
                </div>
              ))}
            </div>

            {/* Divider */}
            <hr className={`my-6 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} />

            {/* Model Info */}
            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`font-bold mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🧠 About the Model
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Algorithm:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>Random Forest</div>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Accuracy:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>~76%</div>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Dataset:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>IBM Telco</div>
                <div className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Samples:</div>
                <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-800'}`}>7,043 customers</div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mt-4">
              <h3 className={`font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>🛠️ Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: 'React', color: 'bg-blue-500/20 text-blue-400' },
                  { name: 'Tailwind', color: 'bg-cyan-500/20 text-cyan-400' },
                  { name: 'FastAPI', color: 'bg-green-500/20 text-green-400' },
                  { name: 'scikit-learn', color: 'bg-orange-500/20 text-orange-400' },
                  { name: 'Python', color: 'bg-yellow-500/20 text-yellow-400' },
                ].map(tech => (
                  <span key={tech.name} className={`px-3 py-1 rounded-full text-sm font-medium ${tech.color}`}>
                    {tech.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`relative z-10 text-center py-6 text-sm border-t ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500'}`}>
        Built for College Mini Project • Machine Learning + Full Stack Demo
      </footer>
    </div>
  )
}

export default App
