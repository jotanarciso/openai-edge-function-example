import { Configuration, OpenAIApi } from "openai-edge";

export default async (event) => {
  const { request } = event;
  const url = new URL(request.url)
  const title = url.searchParams.get('title')


  const configuration = new Configuration({
    apiKey: "YOU_API_KEY",
  });

  const openai = new OpenAIApi(configuration);

  const response = await openai.createImage({
    prompt: title || "an blue rocket at a hackathon",
    size: "512x512",
    response_format: "url",
  });

  const data = await response.json();
  const imgUrl = data.data?.[0]?.url;


  if (!imgUrl) {
    return new Response("No image URL found", { status: 404 });
  }

  const imageResponse = await fetch(imgUrl);

  const imageBlob = await imageResponse.blob();
  return new Response(imageBlob, {
    headers: {
      "Content-Type": imageBlob.type,
    },
  });
};
