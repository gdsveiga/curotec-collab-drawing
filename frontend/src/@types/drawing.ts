export type Stroke = {
  x: number;
  y: number;
  type: "begin" | "draw" | "end";
  strokeSize: number;
  strokeColor: string;
  userId: string;
  id?: string;
};
