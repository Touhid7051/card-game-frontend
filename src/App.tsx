import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import GameBoard from './pages/GameBoard'
import Login from './pages/LoginPages'
import { useAuthContext } from './auth/AuthProvider'
import { Navigate } from 'react-router-dom'

export default function App() {
  const { isAuthenticated } = useAuthContext();
  return (
    <Routes>
      {isAuthenticated ? (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/game/:gameId" element={<GameBoard />} />
          <Route path="/login" element={<Navigate to="/" />} />
        </>
      ) : (
        <Route path="/login" element={<Login />} />
      )}
      <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} />} />
    </Routes>
  )
}
