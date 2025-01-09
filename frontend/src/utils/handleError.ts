import axios from "axios";
import { toast } from "react-toastify";

export const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.error);
      throw new Error(error.response.data.error);
    }
    throw new Error(error.message);
  } else {
    toast.error(String(error));
    throw new Error(String(error));
  }
};
