import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import Books from './pages/Books';
import Issuances from './pages/Issuances';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>

      <Navbar />


      <Routes>

        <Route path="/" element={<Dashboard />} />

        <Route path="/members" element={<Members />} />

        <Route path="/books" element={<Books />} />

        <Route path="/issuances" element={<Issuances />} />

      </Routes>

    </BrowserRouter>
  );
}

export default App;