import { useState, useEffect } from 'react';
import axios from 'axios';

function ApiTest() {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/test');
        setApiData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to connect to API: ' + err.message);
        setApiData(null);
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">API Connection Test</h2>
      {loading && <p className="text-gray-600">Testing connection to NeuroBank API...</p>}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <p className="mt-2 text-sm">
            Make sure the backend server is running on port 5000.
          </p>
        </div>
      )}
      
      {apiData && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <p><strong>Status:</strong> Connected</p>
          <p><strong>Message:</strong> {apiData.message}</p>
          <p><strong>Timestamp:</strong> {apiData.timestamp}</p>
        </div>
      )}
    </div>
  );
}

export default ApiTest;
