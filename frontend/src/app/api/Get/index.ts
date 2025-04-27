import { BASE_API_URL } from "@/const";
import axios from "axios";

const getStickNotes = async () => {
  const getUrl = BASE_API_URL;
  try {
    const response = await axios.get(getUrl);
    return response;
  } catch (error) {
    throw error;
  }
};
export default getStickNotes;
