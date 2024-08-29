import React, { useState, useCallback } from "react";
import Gallery from "react-photo-gallery";
import Carousel, { Modal, ModalGateway } from "react-images";

export default function App({ photos }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setViewerIsOpen(true);
  }

  const closeLightbox = () => {
    setCurrentImage(0);
    setViewerIsOpen(false);
  };

  return (
    <div style={{minWidth:"100%"}}>
      {/* <Gallery photos={photos} onClick={openLightbox} /> */}
      <img src={photos[0].src} className="Gallery__oneImage" onClick={() => { openLightbox(0) }} />
      {(photos[1] && photos[1].src) ? <img src={photos[1].src} className="Gallery__oneImage" onClick={() => { openLightbox(1) }} /> : null}
      <ModalGateway>
        {viewerIsOpen ? (
          <Modal onClose={closeLightbox}>
            <Carousel
              currentIndex={currentImage}
              views={photos.map(x => ({
                ...x,
                srcset: x.srcSet,
                caption: x.title
              }))}
            />
          </Modal>
        ) : null}
      </ModalGateway>
    </div>
  );
}