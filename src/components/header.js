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
                <Link className="button-link" to="/">Home</Link>
                <Link className="button-link" to="/recipes">Recipes</Link>
                <Link className="button-link" to="/meal-planner">Meal Planner</Link>
                <Link className="button-link" to="/pantry">Pantry</Link>
                <Link className="button-link" to="/login">Login/SignIn</Link>
            </nav>
        </div>
    </header>
  );
}

export default Header;