import React from "react";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import EmotionDescription from "./EmotionDescription";
import ActionButton from "./ActionButton";

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

const Result = ({ imgSrc, loading, emotionInfo, onReset }) => {
  return (
    <ResultContainer>
      <h2>Result</h2>

      <img src={imgSrc} alt="screenshot" />
      {emotionInfo && <EmotionDescription emotion={emotionInfo} />}
      {loading && <Loader type="Circles" height="100px" color="#8ab7ff" />}
      {/* only display retry button when processing completes */}
      {!loading && (
        <ActionButton type="button" id="reset-button" onClick={onReset}>
          Try again?
        </ActionButton>
      )}
    </ResultContainer>
  );
};

export default Result;
