"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/app/components/ui/file-upload";
import { BackgroundGradient } from "../ui/background-gradient";
import axios from "axios";

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log("Files selected:", files);
  };

  const handleUploadSubmit = async () => {
    if (files.length === 0) {
      alert("Please select a PDF file first");
      return;
    }

    setIsUploading(true);

    try {
      console.log("Starting upload for files:", files);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("pdfFile", files[0]); // Upload first file (matching backend field name)

      // Upload file to backend
      const uploadResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const uploadResult = uploadResponse.data;
      console.log("Upload completed successfully!", uploadResult);

      if (uploadResult.success) {
        // Navigate to chat page with namespace after successful upload
        const { namespace, originalName } = uploadResult.data;
        router.push(`/chat?namespace=${encodeURIComponent(namespace)}&fileName=${encodeURIComponent(originalName)}`);
      } else {
        throw new Error(uploadResult.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <BackgroundGradient className="rounded-[22px] w-full p-3 sm:p-6 bg-white dark:bg-zinc-900">
      <div className="w-full mx-auto min-h-16 rounded-lg space-y-4">
        <FileUpload onChange={handleFileUpload} />

        {files.length > 0 && (
          <div className="space-y-3">
            {/* Selected Files Display */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium">Selected files:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-2 mt-2"
                >
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <button
              onClick={handleUploadSubmit}
              disabled={isUploading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#2B7FFF] to-[#1E5FE0] hover:shadow-lg hover:shadow-[#2B7FFF]/25 cursor-pointer"
              } text-white`}
            >
              {isUploading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing PDF...</span>
                </div>
              ) : (
                "Start Chatting with PDF"
              )}
            </button>
          </div>
        )}
      </div>
    </BackgroundGradient>
  );
}
