import { Routes, Route, useLocation } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'
import RiskCalculator from './pages/RiskCalculator'
import Portfolio from './pages/Portfolio'
import Analysis from './pages/Analysis'
import Community from './pages/Community'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Pricing from './pages/Pricing'
import Landing from './pages/Landing'

const publicRoutes = ['/', '/login', '/signup', '/pricing']

function App() {
  const location = useLocation()
  const showNav = !publicRoutes.includes(location.pathname)

  return (
    <>
      {showNav && <Navbar />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/journal" element={<ProtectedRoute><Journal /></ProtectedRoute>} />
        <Route path="/risk" element={<ProtectedRoute><RiskCalculator /></ProtectedRoute>} />
        <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
        <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </>
  )
}

export default App