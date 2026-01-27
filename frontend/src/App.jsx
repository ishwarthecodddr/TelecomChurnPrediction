import { useState } from 'react'

function App() {
  // State for form inputs
  const [tenure, setTenure] = useState('')
  const [monthlyCharges, setMonthlyCharges] = useState('')
  const [totalCharges, setTotalCharges] = useState('')
  
  // State for prediction result
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle form submission
  const handlePredict = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      // Send POST request to backend
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tenure: parseInt(tenure),
          MonthlyCharges: parseFloat(monthlyCharges),
          TotalCharges: parseFloat(totalCharges),
        }),
      })

      // Check if request was successful
      if (!response.ok) {
        throw new Error('Prediction failed')
      }

      // Get prediction result
      const data = await response.json()
      setResult(data.churn)
    } catch (err) {
      setError('Error connecting to server. Make sure backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>📞 Telecom Churn Prediction</h1>
      <p className="subtitle">Predict if a customer will leave the service</p>

      <form onSubmit={handlePredict}>
        <div className="form-group">
          <label htmlFor="tenure">Tenure (months)</label>
          <input
            type="number"
            id="tenure"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="e.g., 12"
            required
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="monthlyCharges">Monthly Charges ($)</label>
          <input
            type="number"
            id="monthlyCharges"
            value={monthlyCharges}
            onChange={(e) => setMonthlyCharges(e.target.value)}
            placeholder="e.g., 70.50"
            required
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalCharges">Total Charges ($)</label>
          <input
            type="number"
            id="totalCharges"
            value={totalCharges}
            onChange={(e) => setTotalCharges(e.target.value)}
            placeholder="e.g., 1500.00"
            required
            step="0.01"
            min="0"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Predicting...' : 'Predict Churn'}
        </button>
      </form>

      {/* Display Result */}
      {result && (
        <div className={`result ${result === 'Yes' ? 'churn' : 'no-churn'}`}>
          <h2>Prediction Result</h2>
          <p>
            Customer will churn: <strong>{result}</strong>
          </p>
          {result === 'Yes' ? (
            <span className="emoji">⚠️ High risk of leaving!</span>
          ) : (
            <span className="emoji">✅ Customer likely to stay!</span>
          )}
        </div>
      )}

      {/* Display Error */}
      {error && <div className="error">{error}</div>}
    </div>
  )
}

export default App
