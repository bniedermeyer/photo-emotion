const axios = require("axios").default;

/**
 * Uses the Google Cloud Platform Vision API to identify emotion of face
 * in an image hosted at the given url.
 *
 * @param {string} url the url of the image to evaluate
 */
const getEmotionWithGoogleApi = async (url) => {
  const res = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${process.env.GOOGLE_API_KEY}`,
    {
      requests: [
        {
          image: {
            source: {
              imageUri: url,
            },
          },
          features: [{ maxResults: 10, type: "FACE_DETECTION" }],
        },
      ],
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (res.data && res.data.responses.length > 0) {
    const { faceAnnotations } = res.data.responses[0];
    const {
      joyLikelihood,
      sorrowLikelihood,
      angerLikelihood,
      surpriseLikelihood,
    } = faceAnnotations[0];

    // there is a better way to do this (a good solution would normalize responses between vision api providers),
    // but given time constraints and that this isn't the point of the project (working with LD is) I'm just going to take a hammer to this for now.

    if (joyLikelihood === "VERY_LIKELY") {
      return { emotion: "happiness" };
    } else if (sorrowLikelihood === "VERY_LIKELY") {
      return { emotion: "sadness" };
    } else if (angerLikelihood === "VERY_LIKELY") {
      return { emotion: "anger" };
    } else if (surpriseLikelihood === "VERY_LIKELY") {
      return { emotion: "surprise" };
    } else {
      return { emotion: "none" };
    }
  }
  return undefined;
};

module.exports = getEmotionWithGoogleApi;
