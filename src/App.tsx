import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Todos from './features/todo/Todos';
import { HomePage } from './features/homepage/home';
import Layout from './Layout';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<Todos />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
