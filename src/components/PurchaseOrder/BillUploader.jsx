import React, { useRef } from "react";
import { Button, Group } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { Carousel } from "@mantine/carousel";
import '../../CSS/billUploader.css'
const BillUploader = ({ purchaseList, setPurchaseList, cloudBills, deleteCloudBills }) => {
  const openRef = useRef(null);
  const onSelectFile = (files) => {
    console.log({ files })
    const selectedFilesArray = Array.from(files);
    files.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPurchaseList({
          ...purchaseList,
          bills: [...purchaseList.bills, reader.result],
        });
      };
    });
  };

  function deleteHandler(image) {
    setPurchaseList({
      ...purchaseList,
      bills: purchaseList.bills.filter((e) => e !== image),
    });
    URL.revokeObjectURL(image);
  }
  return (
    <section className="bill-uploader-section">
      <Dropzone
        openRef={openRef}
        activateOnClick={false}
        styles={{ inner: { pointerEvents: "all" } }}
        onDrop={onSelectFile}
      >
        <Group position="center">
          <Button
            onClick={() => {
              openRef.current();
            }}
          >
            Select files
          </Button>
        </Group>
      </Dropzone>
      {purchaseList.bills?.length > 0 || cloudBills.length > 0 ? (
        <Carousel
          sx={{ maxWidth: 600 }}
          className='bill-carousel'
          mx="auto"
          withIndicators
          height={400}
        >
          {purchaseList.bills &&
            purchaseList.bills.map((image, index) => {
              return (
                <Carousel.Slide
                  key={index}
                  style={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <img
                    src={image}
                    className="bill-image"
                    maxwidth={520}
                    alt="upload"
                  />
                  <img
                    className="bill-image-point"
                    height={50}
                    src={window.location.origin + "/closeicon.png"}
                    onClick={() => {
                      deleteHandler(image);
                    }}
                    alt="X"
                  />
                </Carousel.Slide>
              );
            })}
          {cloudBills.map((image, index) => {
            return (
              <Carousel.Slide
                key={index}
                style={{ height: "100%", width: "100%", position: "relative" }}
              >
                <img
                  src={image.secure_url}
                  className="bill-image"
                  maxwidth={120}
                  alt="upload"
                />
                <img
                  className="bill-image-point"
                  height={50}
                  src={window.location.origin + "/closeicon.png"}
                  onClick={() => {
                    deleteCloudBills(index);
                  }}
                  alt="X"
                />
              </Carousel.Slide>
            );
          })}
        </Carousel>
      ) : (
        ""
      )}
    </section>
  );
};

export default BillUploader;
