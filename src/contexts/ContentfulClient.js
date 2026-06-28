import { createClient } from "contentful";

const space = import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const accessToken = import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

if (!space || !accessToken) {
  console.error("Contentful Space ID or Access Token is missing. Please define them in your .env file.");
}

const client = createClient({
  space: space || "",
  accessToken: accessToken || "",
});

export default client;
