
import React, { useEffect } from "react";

const SuggestNotification = ({ message, onClose }) => {
    useEffect(() => {
      const timer = setTimeout(() => {
        onClose();
      }, 10000); // Auto-close the notification after 3 seconds
  
      return () => clearTimeout(timer);
    }, [onClose]);
  
    return (
      <div className="notification">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    );
  };

  export default SuggestNotification