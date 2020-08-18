const arc = require("@architect/functions");
const { uploader } = require("cloudinary").v2;
const parseBody = arc.http.helpers.bodyParser;

exports.handler = async function http(req) {
  const body = parseBody(req);
  const { image } = body;
  console.log("image: ", image);
  try {
    const uploaded = await uploader.upload(image, { resource_type: "image" });
    console.log(uploaded);
    return { statusCode: 200, body: JSON.stringify({ url: uploaded.url }) };
  } catch (error) {
    return { statusCode: 500 };
  }
};
