import clsx from "clsx";
import { ClassNameValue, twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassNameValue[]) => twMerge(clsx(...inputs));
