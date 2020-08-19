const getEmotionWithMicrosoftApi = require("./microsoft-vision");

exports.handler = async function http(req) {
  const { url } = req.queryStringParameters;

  try {
    const emotion = await getEmotionWithMicrosoftApi(url);
    console.log(emotion);
    return {
      headers: {
        "content-type": "application/json; charset=utf8",
        "cache-control":
          "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
      },
      body: JSON.stringify({ emotion: emotion.emotion }),
    };
  } catch (error) {
    console.log("error fetching emotion: ", error);
    return { statusCode: 500 };
  }
};
