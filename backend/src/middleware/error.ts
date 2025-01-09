export const handleError = (err: unknown, req: any, res: any, next: any) => {
  if (err instanceof Error) {
    res.status(400).json({ error: err.message });
  } else {
    res.status(400).json({ error: "An unknown error occurred" });
  }
};
