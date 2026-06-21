"use client";

import { useEffect, useRef, useState } from "react";

type ServiceImageUploadProps = {
  resetKey: string | boolean;
  existingImageUrl?: string | null;
  required?: boolean;
  inputId?: string;
};

export default function ServiceImageUpload({
  resetKey,
  existingImageUrl = null,
  required = true,
  inputId = "service-image",
}: ServiceImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [resetKey]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      setPreview(null);
      return;
    }

    setPreview((current) => {
      if (current?.startsWith("blob:")) {
        URL.revokeObjectURL(current);
      }

      return URL.createObjectURL(file);
    });
  }

  const displayImage = preview ?? existingImageUrl;

  return (
    <div className="flex flex-col items-center">
      <label htmlFor={inputId} className="group cursor-pointer">
        <input
          ref={inputRef}
          id={inputId}
          name="image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          required={required && !existingImageUrl}
          className="sr-only"
          onChange={handleChange}
        />

        <span className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/30 bg-primary/5 transition-colors group-hover:border-primary group-hover:bg-primary/10">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={displayImage} alt="Service preview" className="h-full w-full object-cover" />
          ) : (
            <svg
              className="h-10 w-10 text-primary/70 transition-colors group-hover:text-primary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          )}

          {displayImage && (
            <span className="absolute inset-0 flex items-center justify-center bg-primary-dark/0 transition-colors group-hover:bg-primary-dark/40">
              <svg
                className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
          )}
        </span>
      </label>

      <p className="mt-3 text-sm font-medium text-foreground">
        {existingImageUrl ? "Change service image" : "Upload service image"}
      </p>
      <p className="mt-1 text-xs text-muted">
        {required && !existingImageUrl
          ? "JPG, PNG, WebP, or GIF · Max 5 MB"
          : "Optional · JPG, PNG, WebP, or GIF · Max 5 MB"}
      </p>
    </div>
  );
}
