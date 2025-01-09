import { Stroke } from "src/@types/drawing";
import { axiosClient } from "src/config/client";
import { handleError } from "src/utils/handleError";

export type GetDrawingsResponse = {
  createdAt: string;
  strokes: Stroke[];
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
};
