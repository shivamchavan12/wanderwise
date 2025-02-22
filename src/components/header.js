import React from 'react';
import { Link } from 'react-router-dom';
import './header.css';

function Header() {
  return (
    <header className="hello">
        <div className="sticky-header">
            <div className="logo">
                <Link className="name" to="/">WanderWise</Link>
            </div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/recipes">Recipes</Link>
                <Link to="/meal-planner">Meal Planner</Link>
                <Link to="/pantry">Pantry</Link>
                <Link to="/login">Login/SignIn</Link>
            </nav>
        </div>
    </header>
  );
}

export default Header;