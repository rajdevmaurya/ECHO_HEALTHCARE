import React, { useState, useEffect } from "react";

const ImageScroller = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  const goLeft = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goRight = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const selectImage = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "450px", overflow: "hidden" }}>
      {/* Navigation Circles */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
          zIndex: 2,
        }}
      >
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => selectImage(index)}
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: index === currentIndex ? "white" : "rgba(255, 255, 255, 0.5)",
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* Left and Right Buttons with creative look */}
      <button
        onClick={goLeft}
        style={{
          position: "absolute",
          top: "50%",
          left: "20px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          fontSize: "30px",
          padding: "15px 20px",
          cursor: "pointer",
          zIndex: 1,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#f39c12"; // Change color on hover
          e.target.style.transform = "translateY(-50%) scale(1.1)"; // Slightly enlarge
        }}
        onMouseOut={(e) => {
          e.target.style.background = "rgba(0,0,0,0.7)";
          e.target.style.transform = "translateY(-50%)"; // Reset the scale
        }}
      >
        ❮
      </button>
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex}`}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
          transition: "transform 0.5s ease-in-out",
        }}
      />
      <button
        onClick={goRight}
        style={{
          position: "absolute",
          top: "50%",
          right: "20px",
          transform: "translateY(-50%)",
          background: "rgba(0,0,0,0.7)",
          color: "white",
          border: "none",
          borderRadius: "50%",
          fontSize: "30px",
          padding: "15px 20px",
          cursor: "pointer",
          zIndex: 1,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => {
          e.target.style.background = "#f39c12"; // Change color on hover
          e.target.style.transform = "translateY(-50%) scale(1.1)"; // Slightly enlarge
        }}
        onMouseOut={(e) => {
          e.target.style.background = "rgba(0,0,0,0.7)";
          e.target.style.transform = "translateY(-50%)"; // Reset the scale
        }}
      >
        ❯
      </button>

      {/* Image Numbers */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginTop: "10px",
          fontSize: "18px",
          fontWeight: "bold",
        }}
      >
        {images.map((_, index) => (
          <span
            key={index}
            style={{
              color: index === currentIndex ? "black" : "gray",
              cursor: "pointer",
            }}
            onClick={() => selectImage(index)}
          >
            {index + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ImageScroller;
