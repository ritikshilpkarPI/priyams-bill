import React, { useRef } from "react";
import { Button, Group } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { Carousel } from "@mantine/carousel";

const BillUploader = ({ purchaseList, setPurchaseList, cloudBills ,deleteCloudBills }) => {
  const openRef = useRef(null);
  const onSelectFile = (event) => {
    const selectedFiles = event.target.files;
    const selectedFilesArray = Array.from(selectedFiles);
    selectedFilesArray.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setPurchaseList({
          ...purchaseList,
          bills: [...purchaseList.bills, reader.result],
        });
      };
    });
    event.target.value = "";
  };

  function deleteHandler(image) {
    setPurchaseList({
      ...purchaseList,
      bills: purchaseList.bills.filter((e) => e !== image),
    });
    URL.revokeObjectURL(image);
  }
  return (
    <section style={{ width: "80%", margin: "auto", marginTop: "5vmin" }}>
      <Dropzone
        openRef={openRef}
        activateOnClick={false}
        styles={{ inner: { pointerEvents: "all" } }}
        onChange={onSelectFile}
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
          style={{ marginTop: "5vmin" }}
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
                    style={{ height: "100%" }}
                    maxwidth={520}
                    alt="upload"
                  />
                  <img
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: "0%",
                      left: "90%",
                    }}
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
                  style={{ height: "100%" }}
                  maxwidth={520}
                  alt="upload"
                />
                <img
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    top: "0%",
                    left: "90%",
                  }}
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
