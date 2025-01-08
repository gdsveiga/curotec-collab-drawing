import { Stroke } from "src/@types/drawing";
import { axiosClient } from "src/config/client";

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
      console.error(error);
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error(String(error));
      }
    }
  },
};
