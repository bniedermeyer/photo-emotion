/* global fetch */
import React, { useRef, useState, useCallback, useEffect } from "react";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import Webcam from "react-webcam";
import styled from "styled-components";

import EmotionDescription from "./components/EmotionDescription";

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
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
  const [email, setEmail] = useState(null);

  useEffect(() => {
    // handles uploading the image to cloud storage and making request for face detection
    const postImage = async () => {
      if (imgSrc) {
        setLoading(true);
        try {
          setEmotionInfo(null);
          // todo: consider moving this to something like a useFetch hook
          const response = await fetch("/upload-image", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imgSrc }),
          });

          // this is the url of the photo that will be used in the response to the computer vision api
          const { url } = await response.json();
          let emotionRequestUrl = `/emotion?url=${url}`;
          if (email) {
            emotionRequestUrl += `&email=${email}`;
          }
          const emotionResponse = await fetch(emotionRequestUrl);

          const emotionInfo = await emotionResponse.json();
          setEmotionInfo(emotionInfo);
        } catch (err) {
          alert("An error occured analyizing your photo, please try again");
        }
        setLoading(false);
      }
    };

    postImage();
  }, [imgSrc, email]);

  // this takes the photo from the webcam stream. Called by the take photo button below
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef, setImgSrc]);

  // determine which content to display (photo booth mode or display results)
  let content;
  if (imgSrc) {
    content = (
      <ResultContainer>
        <h2>Result</h2>

        <img src={imgSrc} alt="screenshot" />
        {emotionInfo && <EmotionDescription emotion={emotionInfo} />}
        {loading && <Loader type="Circles" height="100px" color="#8ab7ff" />}
        {/* only display retry button when processing completes */}
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
    );
  } else {
    content = (
      <WebcamContainer>
        <label>
          Help us test new features! Enter your email:
          <input
            type="email"
            id="email-input"
            name="email-input"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
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
    );
  }

  return (
    <AppContainer>
      <h1>Detect Your Emotions!</h1>

      {content}
    </AppContainer>
  );
};

export default App;
