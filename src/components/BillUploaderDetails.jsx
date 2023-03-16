import React from 'react';
import { Carousel } from '@mantine/carousel';
import '../CSS/billUploader.css';
const BillUploaderDetails = ({ cloudBills }) => {
  return (
    <section style={{ width: '100%', margin: 'auto', marginTop: '5vmin' }}>
      {cloudBills.length > 0 ? (
        <Carousel
          sx={{ maxWidth: 600 }}
          style={{ marginTop: '5vmin' }}
          mx="auto"
          withIndicators
          height={400}
        >
          {cloudBills.map((image, index) => {
            return (
              <Carousel.Slide
                key={index}
                style={{ height: '100%', width: '100%', position: 'relative' }}
              >
                <img
                  src={image.secure_url}
                  className="bill-image"
                  maxwidth={120}
                  alt="upload"
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      ) : (
        ''
      )}
    </section>
  );
};

export default BillUploaderDetails;
