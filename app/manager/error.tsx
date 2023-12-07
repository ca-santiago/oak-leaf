"use client";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div className="mx-auto w-80 flex flex-col items-centera">
      <h2 className="text-center">Something went wrong!</h2>
      <button
        className="p-2 rounded-md text-white bg-blue-500"
        onClick={() => reset()}
      >
        Try again
      </button>
    </div>
  );
}