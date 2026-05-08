import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import ReportForm from './pages/ReportForm'
import TrackCase from './pages/TrackCase'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<ReportForm />} />
        <Route path="/track" element={<TrackCase />} />
      </Routes>
    </BrowserRouter>
  )
}
