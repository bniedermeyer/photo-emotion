/* global fetch */
import React, { useRef, useState, useCallback, useEffect } from "react";
import { withLDProvider } from "launchdarkly-react-client-sdk";
import styled from "styled-components";

import PhotoBooth from "./components/PhotoBooth";
import Result from "./components/Result";

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const App = () => {
  const webcamRef = useRef(null);
  const [imgSrc, setImgSrc] = useState(null);
  const [emotionInfo, setEmotionInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

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
          if (email.length > 0) {
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

  const onEmailChange = (event) => setEmail(event.target.value);

  const onReset = () => setImgSrc(null);

  // determine which content to display (photo booth mode or display results)
  let content;
  if (imgSrc) {
    content = (
      <Result
        imgSrc={imgSrc}
        loading={loading}
        emotionInfo={emotionInfo}
        onReset={onReset}
      />
    );
  } else {
    content = (
      <PhotoBooth
        capture={capture}
        webcamRef={webcamRef}
        email={email}
        onEmailChange={onEmailChange}
      />
    );
  }

  return (
    <AppContainer>
      <h1>Detect Your Emotions!</h1>

      {content}
    </AppContainer>
  );
};

export default withLDProvider({
  // it's safe to paste the client key with the react sdk
  clientSideID: "5f3c84144c4ff20a392ef747",
})(App);
