const axios = require("axios").default;

const getEmotionWithMicrosoftApi = async (url) => {
  console.log("fetching emotion for photo: ", url);
  const baseUrl = process.env.AZURE_ENDPOINT;
  const requestUrl =
    baseUrl +
    "/face/v1.0/detect?returnFaceId=true&returnFaceAttributes=emotion";

  const res = await axios.post(
    requestUrl,
    { url },
    {
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": process.env.AZURE_API_KEY,
      },
    }
  );
  if (res.data.length > 0) {
    const { faceAttributes } = res.data[0];

    const emotion = Object.keys(faceAttributes.emotion).reduce(
      (acc, key) => {
        if (
          faceAttributes.emotion.hasOwnProperty(key) &&
          faceAttributes.emotion[key] > acc.value
        ) {
          return { emotion: key, value: faceAttributes.emotion[key] };
        } else {
          return acc;
        }
      },
      {
        emotion: "NO EMOTION DETECTED",
        value: 0,
      }
    );
    return emotion;
  }
  return undefined;
};

module.exports = getEmotionWithMicrosoftApi;
