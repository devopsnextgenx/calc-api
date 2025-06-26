import React from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Home from './Home/Home';
import About from './About/About';
import './App.css';
import RepoList from './RepoList/RepoList';
import ContentFrame from './ContentFrame/ContentFrame';

const App = () => {
  return (
    <Router>
      <Header />
      <div className='app-frame'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/content" element={<ContentFrame />} />
          <Route path="/repoList" element={<RepoList />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;