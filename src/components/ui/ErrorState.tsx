"use client";

import Button from "@/components/ui/Button";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorState({
  message,
  onRetry,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 px-4 w-full ${className}`}
    >
      <p className="text-red-600 body-medium text-center max-w-md">{message}</p>
      {onRetry && (
        <Button as="button" size="sm" variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
