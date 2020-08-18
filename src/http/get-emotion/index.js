const axios = require("axios").default;

exports.handler = async function http(req) {
  const { url } = req.queryStringParameters;
  console.log("fetching emotion for photo: ", url);
  const baseUrl = process.env.AZURE_ENDPOINT;
  const requestUrl =
    baseUrl +
    "/face/v1.0/detect?returnFaceId=true&returnFaceAttributes=emotion";

  try {
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
    console.log(res.data);
    const { faceAttributes } = res.data[0];

    return {
      headers: {
        "content-type": "application/json; charset=utf8",
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      },
      body: JSON.stringify({ emotion: faceAttributes.emotion }),
    };
  } catch (error) {
    console.log("error fetching emotion: ", error);
    return { statusCode: 500 };
  }
};
