import React from "react";
import { withLDConsumer } from "launchdarkly-react-client-sdk";
import Webcam from "react-webcam";
import ActionButton from "./ActionButton";
import styled from "styled-components";

const WebcamContainer = styled.div`
  margin: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 600px;
`;

const PhotoBooth = ({
  flags,
  ldClient,
  capture,
  webcamRef,
  email,
  onEmailChange,
}) => {
  return (
    <WebcamContainer>
      {flags.allowBetaUsers && (
        <label>
          Help us test new features! Enter your email:
          <input
            type="email"
            id="email-input"
            name="email-input"
            value={email}
            onChange={onEmailChange}
          />
        </label>
      )}
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
};

export default withLDConsumer()(PhotoBooth);
