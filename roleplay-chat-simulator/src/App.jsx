/**
 * Main App Component
 * Root component with routing and global providers
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext.jsx';
import CharacterPicker from './pages/CharacterPicker.jsx';
import ChatInterface from './pages/ChatInterface.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<CharacterPicker />} />
              <Route path="/chat" element={<ChatInterface />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;