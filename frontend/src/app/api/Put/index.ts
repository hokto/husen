import { BASE_API_URL } from "@/const";
import { PutRequest } from "@/types/API";
import axios from "axios";

const putStickNotes = async (id: string, request: PutRequest) => {
  const putUrl = BASE_API_URL + id;
  try {
    const response = await axios.put(putUrl, request);
    return response;
  } catch (error) {
    throw error;
  }
};

export default putStickNotes;
