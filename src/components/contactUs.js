import React, { useState } from 'react';
import './contactUs.css';

const ContactUs = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };

    return (
        <div className="contact-page">
            <div className="contact-container">
                <h1>Contact Us</h1>
                <p>We’d love to hear from you! Drop us a message and we’ll get back to you soon.</p>

                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Your Name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        required 
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Your Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        required 
                    />
                    <textarea 
                        name="message" 
                        placeholder="Your Message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        required 
                    />
                    <button type="submit">Send Message</button>
                </form>

                {submitted && <p className="success-msg">Thanks for reaching out! We'll get back to you soon.</p>}
            </div>
        </div>
    );
};

export default ContactUs;
