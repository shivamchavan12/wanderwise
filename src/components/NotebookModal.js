import React from 'react';
import { X } from 'lucide-react';
import './NotebookModal.css';

const NotebookModal = ({ isOpen, onClose, itinerary }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <h2>Your Travel Itinerary</h2>
          <button onClick={onClose} className="close-button">
            <X />
          </button>
        </div>

        {/* Modal Content - Notebook Style */}
        <div className="modal-content">
          <div className="notebook-page">
            {/* Notebook Hole Decorations */}
            <div className="notebook-holes">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="hole" />
              ))}
            </div>

            {/* Red Margin Line */}
            <div className="margin-line"></div>

            {/* Content Area */}
            <div className="itinerary-content">
              {itinerary.map((day, index) => (
                <div key={index} className="day-section">
                  <h3>{day.title}</h3>
                  <ul>
                    {day.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={onClose} className="close-itinerary-button">
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotebookModal;