import { Stroke } from "src/@types/drawing";
import { axiosClient } from "src/config/client";
import { handleError } from "src/utils/handleError";

export type GetDrawingsResponse = {
  createdAt: string;
  strokes: Stroke[];
  userId: string;
  _id: string;
  __v: number;
};

export const drawingService = {
  async getDrawings(): Promise<GetDrawingsResponse[]> {
    try {
      const response = await axiosClient.get("/drawings");
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async download(): Promise<string> {
    try {
      const response = await axiosClient.get("/drawings/download");
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};
