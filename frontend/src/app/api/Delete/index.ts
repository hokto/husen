import { BASE_API_URL } from "@/const";
import axios from "axios";

const deleteStickNotes = async (id: string) => {
  const deleteUrl = BASE_API_URL + id;
  try {
    const response = await axios.delete(deleteUrl);
    return response;
  } catch (error) {
    throw error;
  }
};

export default deleteStickNotes;
