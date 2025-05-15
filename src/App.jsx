import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import PolicyTool from './pages/PolicyTool';
import { useState, useEffect } from 'react'
import './App.css'
import Header from './components/Header'

function App() {
  const [theme, setTheme] = useState('macchiato')

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const switchTheme = (newTheme) => {
    setTheme(newTheme);
  }

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Header onThemeSwitch={switchTheme} />
        <main className="content">
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="contact" element={<Contact />} />
              <Route path="policy-tool" element={<PolicyTool />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
