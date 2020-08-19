import React from "react";
import styled from "styled-components";

const EmotionContainer = styled.div`
  text-align: center;
  font-size: 1.3rem;
  color: white;
  margin: 10px;
`;

const EmotionDescription = ({ emotion }) => {
  let emotionVisual;
  let message;

  switch (emotion.emotion) {
    case "happiness":
      emotionVisual = "😀";
      message = "Great, you're happy!";
      break;
    case "sadness":
      emotionVisual = "😭";
      message = "Cheer up, friend!";
      break;

    case "anger":
    case "contempt":
    case "disgust":
      emotionVisual = "😡";
      message = "Nothing to be mad about!";
      break;

    case "surprise":
      emotionVisual = "😲";
      message = "Surprise!";
      break;

    case "fear":
      emotionVisual = "😰";
      message = "Nothing to be scare of!";
      break;

    case "neutral":
      emotionVisual = "😐";
      message = "Could be better, could be worse";
      break;

    default:
      emotionVisual = "⁇";
      message = "We can't tell, try again!";
      break;
  }

  return (
    <EmotionContainer>
      <p>{emotionVisual}</p>
      <p>{message}</p>
    </EmotionContainer>
  );
};

export default EmotionDescription;
