const { v4: uuidv4 } = require("uuid");
const LaunchDarkly = require("launchdarkly-node-server-sdk");
const getEmotionWithMicrosoftApi = require("./microsoft-vision");
const getEmotionWithGoogleApi = require("./google-vision");

const ldClient = LaunchDarkly.init(process.env.LD_API_KEY);

/**
 * Uses computer vision provider to detect the emotion displayed in the face
 * of the person in the photo. Due to the variety of response forms from
 * the different vision providers, this endpoint returns the emotion that
 * is ranked most likely to be accurate.
 *
 * @param {*} req the request object
 */
exports.handler = async function http(req) {
  const { url, email } = req.queryStringParameters;
  const headers = {
    "content-type": "application/json; charset=utf8",
    "cache-control":
      "no-cache, no-store, must-revalidate, max-age=0, s-maxage=0",
  };

  if (!url) {
    return { statusCode: 400, headers };
  }

  try {
    await ldClient.waitForInitialization();
    const userKey = email ? email : uuidv4();
    const userEmail = email ? email : "not-supplied";
    let user = {
      key: userKey,
      anonymous: email === undefined,
      email: userEmail,
    };

    const visionProvider = await ldClient.variation(
      "vision-api-provider",
      user,
      "Microsoft"
    );
    // since this is an ephemeral function, release all resources
    ldClient.close();

    let emotion;

    if (visionProvider === "Microsoft") {
      console.info("SEND REQUEST TO AZURE ");
      emotion = await getEmotionWithMicrosoftApi(url);
    } else if (visionProvider === "Google") {
      console.info("SEND REQUEST TO GOOGLE ");
      emotion = await getEmotionWithGoogleApi(url);
    }

    return {
      headers,
      body: JSON.stringify({ emotion: emotion.emotion }),
    };
  } catch (error) {
    console.log("error fetching emotion: ", error);
    return { statusCode: 500, headers };
  }
};
