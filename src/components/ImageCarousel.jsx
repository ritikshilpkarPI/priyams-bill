import React, { useState } from 'react';
import Preview from 'src/icons/preview';
import Next from 'src/icons/next';
import "../CSS/ImageCarousel.css"
import Delete from 'src/icons/Delete';

const ImageCarousel = ({ imageList, setImageList }) => {
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    const handlePrevious = () => {
        if (currentPhotoIndex > 0) {
            setCurrentPhotoIndex(currentPhotoIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentPhotoIndex < imageList.length - 1) {
            setCurrentPhotoIndex(currentPhotoIndex + 1);
        }
    };

    const handleDelete = () => {
        if (imageList.length > 0) {
            const updatedImageList = imageList.filter((_, index) => index !== currentPhotoIndex);
            setImageList(updatedImageList);

            // Adjust the currentPhotoIndex after deletion
            if (currentPhotoIndex >= updatedImageList.length && updatedImageList.length > 0) {
                setCurrentPhotoIndex(updatedImageList.length - 1);
            } else if (updatedImageList.length === 0) {
                setCurrentPhotoIndex(0); // Reset index when no images are left
            }
        }
    };

    return (
        <div className='image-carousel-container'>
        {imageList.length ?(

        
                <div className='carousel'>
                    <div className='carousel-image-container'>
                        <img
                            className='carousel-image'
                            src={imageList[currentPhotoIndex]}
                            alt={`Image ${currentPhotoIndex + 1}`}
                        />
                    </div>

                    {imageList.length > 1 && (
                        <div className='carousel-controls'>
                            <button
                                className='carousel-button'
                                onClick={handlePrevious}
                                disabled={currentPhotoIndex === 0}
                            >
                                <Preview />
                            </button>

                            <button
                                className='carousel-button'
                                onClick={handleNext}
                                disabled={currentPhotoIndex === imageList.length - 1}
                            >
                                <Next />
                            </button>
                        </div>
                    )}

                    <div className='carousel-delete-container'>
                        <button
                            className='carousel-delete-button'
                            onClick={handleDelete}
                        >
                            <Delete/>
                        </button>
                    </div>
                </div>):''
            
        }
                </div>
    );
};

export default ImageCarousel;
