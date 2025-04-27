import { BASE_API_URL } from "@/const";
import { PostRequest } from "@/types/API";
import axios from "axios";

const postStickNotes = async (request: PostRequest) => {
  const postUrl = BASE_API_URL;
  try {
    const response = await axios.post(postUrl, request);
    return response;
  } catch (error) {
    throw error;
  }
};
export default postStickNotes;
