import React from 'react';
import './About.css';

const About: React.FC = () => {
    return (
        <div className="about-container">
            <h1>About Us</h1>
            <p>Welcome to our application! We are dedicated to providing the best user experience.</p>
            <div className="about-content">
                <section>
                    <h2>Our Mission</h2>
                    <p>To create innovative solutions that make a difference in people's lives.</p>
                </section>
                <section>
                    <h2>What We Do</h2>
                    <p>We develop cutting-edge applications using modern technologies like Electron and React!!</p>
                </section>
            </div>
        </div>
    );
};

export default About;