import { type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const shared =
  "w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none transition focus:border-violet-400";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export function Input({ error, className = "", ...rest }: InputProps) {
  return (
    <input
      className={`${shared} ${error ? "border-rose-500 focus:border-rose-400" : ""} ${className}`}
      {...rest}
    />
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: boolean;
};

export function Textarea({ error, className = "", ...rest }: TextareaProps) {
  return (
    <textarea
      className={`${shared} ${error ? "border-rose-500 focus:border-rose-400" : ""} ${className}`}
      {...rest}
    />
  );
}
