/* global fetch */
import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const WebcamContainer = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const PhotoButton = styled.button`
  margin: 20px;
  height: 100px;
  width: 400px;
  background: transparent;
  color: white;
  border: 3px solid white;
  font-size: 2rem;
`;

const App = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);

  useEffect(() => {
    const postImage = async () => {
      if (imgSrc) {
        const response = await fetch("/upload-image", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imgSrc }),
        });
        const { url } = await response.json();
        const emotion = await fetch(`/emotion?url=${url}`);
        console.log(emotion);
      }
    };

    postImage();
  }, [imgSrc]);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  return (
    <Container>
      <WebcamContainer>
        {" "}
        <Webcam
          audio={false}
          mirrored={true}
          ref={webcamRef}
          screenshotFormat="image/png"
        />
        <PhotoButton onClick={capture}>Take Photo</PhotoButton>
      </WebcamContainer>

      {imgSrc && <img src={imgSrc} alt="screenshot" />}
    </Container>
  );
};

export default App;
