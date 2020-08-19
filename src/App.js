/* global fetch */
import React, { useRef, useState, useCallback, useEffect } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Webcam from "react-webcam";
import styled from "styled-components";

import EmotionDescription from "./components/EmotionDescription";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WebcamContainer = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
`;

const ResultContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  padding: 10px;
  height: 700px;
  color: white;
`;

const ActionButton = styled.button`
  margin: 20px;
  height: 100px;
  width: 400px;
  background: #520052;
  color: white;
  border: 3px solid white;
  font-size: 2rem;
`;

const App = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [emotionInfo, setEmotionInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const postImage = async () => {
      if (imgSrc) {
        setLoading(true);
        try {
          setEmotionInfo(null);
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
          const rawEmotion = await emotion.json();
          setEmotionInfo(rawEmotion);
        } catch (err) {
          alert("An error occured analyizing your photo, please try again");
        }
        setLoading(false);
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
      {!imgSrc && (
        <WebcamContainer>
          <Webcam
            audio={false}
            mirrored={true}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={{ facingMode: "user" }}
            id="webcam"
          />
          <ActionButton type="button" id="take-photo-button" onClick={capture}>
            Take Photo
          </ActionButton>
        </WebcamContainer>
      )}
      {imgSrc && (
        <>
          <ResultContainer>
            <h1>Result</h1>

            <img src={imgSrc} alt="screenshot" />
            {emotionInfo && <EmotionDescription emotion={emotionInfo} />}
            {loading && (
              <Loader type="Circles" height="100px" color="#8ab7ff" />
            )}
            {!loading && (
              <ActionButton
                type="button"
                id="reset-button"
                onClick={() => setImgSrc(null)}
              >
                Try again?
              </ActionButton>
            )}
          </ResultContainer>
        </>
      )}
    </Container>
  );
};

export default App;
