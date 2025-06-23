import React from 'react';
import './Header.css';
import Navbar from './Navbar/Navbar';

const Header: React.FC = () => {
    return (
        <>
            <header className="debug-element header">
                <h1>Application Header X</h1>
            </header>
            <Navbar />
        </>
    );
};

export default Header;