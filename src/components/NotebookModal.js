import React, { useRef } from 'react';
import { X } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './NotebookModal.css';

const NotebookModal = ({ isOpen, onClose, itinerary, galleryImages }) => {
  // Define useRef at the top level (before any conditionals)
  const notebookRef = useRef(null);

  // Ensure that hooks are called unconditionally
  if (!isOpen) {
    return null;
  }

  // Helper function to remove '#' and '*' characters from a given text
  const cleanText = (text) => text.replace(/[#*]/g, '');

  // Handler to convert notebook content to PDF
  const handleDownload = () => {
    if (notebookRef.current) {
      html2canvas(notebookRef.current, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
  
        let heightRatio = imgHeight / imgWidth;
        let pdfCanvasHeight = pdfWidth * heightRatio;
  
        let position = 0; // Tracks the Y-axis position in the PDF
  
        while (position < imgHeight) {
          let remainingHeight = imgHeight - position;
          let sliceHeight = Math.min(remainingHeight, imgWidth * (pdfHeight / pdfWidth));
  
          const croppedCanvas = document.createElement('canvas');
          croppedCanvas.width = imgWidth;
          croppedCanvas.height = sliceHeight;
  
          const ctx = croppedCanvas.getContext('2d');
          ctx.drawImage(canvas, 0, position, imgWidth, sliceHeight, 0, 0, imgWidth, sliceHeight);
  
          const croppedImgData = croppedCanvas.toDataURL('image/png');
          pdf.addImage(croppedImgData, 'PNG', 0, 0, pdfWidth, (pdfWidth * sliceHeight) / imgWidth);
  
          position += sliceHeight; // Move position down for the next page
  
          if (position < imgHeight) {
            pdf.addPage();
          }
        }
  
        pdf.save('notebook.pdf');
      });
    }
  };
  

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
          <div className="notebook-page" ref={notebookRef}>
            {/* Gallery Section */}
            {galleryImages && galleryImages.length > 0 && (
              <div className="gallery">
                {galleryImages.map((imgSrc, idx) => (
                  <img
                    key={idx}
                    src={imgSrc}
                    alt={`Gallery Image ${idx + 1}`}
                    className="gallery-image"
                  />
                ))}
              </div>
            )}

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
                  <h3>{cleanText(day.title)}</h3>
                  <ul>
                    {day.activities.map((activity, i) => (
                      <li key={i}>{cleanText(activity)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button onClick={handleDownload} className="download-button">
            Download PDF
          </button>
          <button onClick={onClose} className="close-itinerary-button">
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotebookModal;
