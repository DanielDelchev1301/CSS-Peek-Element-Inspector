import React, { useCallback, useEffect, useRef, useState } from "react";
import { handleHideShowBtn } from "../utils/helperFunctions.js";

const DesignCompare = ({open, setTabOpen, popupOnRight, hidePopup, setHidePopup, overlayRef}) => {
  const [image, setImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [opacity, setOpacity] = useState(0.4);

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (image) {
      const img = document.createElement("img");
      img.src = URL.createObjectURL(image);
      img.alt = "Whole Page Preview";
      img.className = "whole-page-preview-image";
      img.style.opacity = opacity;
      img.ref = imageRef;
      imageRef.current = img;
      document.body.appendChild(img);
    }
  }, [image]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload image files only.");
      return;
    }

    setImage(file);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload image files only.");
      return;
    }

    setImage(file);
  }, []);

  const handleOpacityChange = (value) => {
    setOpacity(parseFloat(value));
    if (imageRef.current) {
      imageRef.current.style.opacity = value;
    }
  };

  const handleRemoveImage = () => {
    if (imageRef.current) {
      document.body.removeChild(imageRef.current);
      imageRef.current = null;
      fileInputRef.current.value = null;
    }
    setImage(null);
  }

  return (
    <>
      {hidePopup 
        ? <div 
            style={{display: open ? "block" : "none"}}
            className={`element-hidden-overlay ${popupOnRight ? "popup-right" : "popup-left"}`}
          >
            <button 
              className="popup-hide-btn"
              onClick={() => handleHideShowBtn(false, () => overlayRef.current.style.display = "block", setHidePopup)}
            >
              Show
            </button>
          </div>
        : <div 
            style={{display: open ? "block" : "none"}} 
            className={`element-design-overlay ${popupOnRight ? "popup-right" : "popup-left"}`}
          >
            <button 
              className="close-design-btn" 
              onClick={() => setTabOpen(state => ({...state, design: false}))}
            >
              Close
            </button>
            <button 
              className="popup-hide-btn" 
              onClick={() => handleHideShowBtn(true, () => overlayRef.current.style.display = "none", setHidePopup)}
              >
                Hide
            </button>

            <h3 style={{color: "#676767"}}>Design Compare</h3>
            <p>Upload an image from Figma/Adobe XD/Sketch or another design tool, to compare with your current page design.</p>

            {image && 
              <button
                className="remove-image-btn" 
                onClick={handleRemoveImage}>
                  Remove image
              </button>
            }
          
            <div className="design-main-flex-container">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileSelect}
              />

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`dropzone ${
                  isDragging ? "dragging" : "default"
                }`}
                style={{ userSelect: "none" }}
              >
                {image ? (
                  <div>
                    <p style={{fontWeight: "bold"}}>{image.name}</p>
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Preview"
                      className="preview"
                    />
                  </div>
                ) : (
                  <p>Drag and drop an image here, or click to select one.</p>
                )}
              </div>

              {image && (
                <div className="slider-container">
                  <input
                    type="range"
                    id="whole-page-image-opacity"
                    name="opacity"
                    min="0"
                    max="1"
                    value={opacity}
                    step="0.01" 
                    onChange={(e) => handleOpacityChange(e.target.value)}
                  />
                  <label htmlFor="whole-page-image-opacity">Opacity</label>
                </div>
              )}
            </div>
          </div>
      }
    </>
  );
};

export default DesignCompare;