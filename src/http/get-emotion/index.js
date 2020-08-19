const getEmotionWithMicrosoftApi = require("./microsoft-vision");
const LaunchDarkly = require("launchdarkly-node-server-sdk");
const ldClient = LaunchDarkly.init(process.env.LD_API_KEY);

exports.handler = async function http(req) {
  const { url } = req.queryStringParameters;

  try {
    await ldClient.waitForInitialization();
    const visionProvider = await ldClient.variation(
      "vision-api-provider",
      { key: "contact@brenden.dev" },
      false
    );
    // since this is an ephemeral function, release all resources
    ldClient.close();

    let emotion;

    if (visionProvider === "Microsoft") {
      emotion = await getEmotionWithMicrosoftApi(url);
    } else if (visionProvider === "Google") {
      console.log("SEND REQUEST TO GOOGLE ");
      emotion = { emotion: "google" };
    }

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
