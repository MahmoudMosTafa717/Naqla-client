import { useCallback, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { Button } from "../../../components/ui/Button";

const MAX_SIZE_MB = 5;

export default function CVUploadSection({
  profile,
  onUpload,
  uploading,
  uploadProgress,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState("");

  const parseStatus = profile?.resume?.parseStatus ?? "none";
  const fileName = profile?.resume?.fileName;

  const validateAndUpload = useCallback(
    async (file) => {
      setLocalError("");
      if (!file) return;
      if (file.type !== "application/pdf") {
        setLocalError("Only PDF files are allowed.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setLocalError(`File must be smaller than ${MAX_SIZE_MB}MB.`);
        return;
      }
      await onUpload(file);
    },
    [onUpload],
  );

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    validateAndUpload(file);
  };

  const statusMessage = () => {
    switch (parseStatus) {
      case "pending":
      case "processing":
        return "Parsing your resume with AI…";
      case "done":
        return "Resume parsed successfully.";
      case "failed":
        return profile?.resume?.parseError || "Parsing failed. You can still edit manually.";
      default:
        return null;
    }
  };

  const status = statusMessage();

  return (
    <div className="space-y-6">
      <div
        role="button"
        tabIndex={0}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
          dragOver
            ? "border-brand-teal bg-brand-teal/5"
            : "border-slate-200 hover:border-brand-teal/50 bg-slate-50/50"
        }`}
        aria-label="Upload resume PDF"
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => validateAndUpload(e.target.files?.[0])}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-brand-teal/10 flex items-center justify-center text-brand-teal">
            <Upload className="w-7 h-7" />
          </div>
          <p className="text-base font-semibold text-slate-800">
            Drag & drop your resume here
          </p>
          <p className="text-sm text-slate-500">PDF only · Max {MAX_SIZE_MB}MB</p>
          {fileName && (
            <p className="text-sm text-brand-teal font-medium flex items-center gap-1">
              <FileText className="w-4 h-4" />
              {fileName}
            </p>
          )}
        </div>
      </div>

      {uploading && (
        <div role="status" aria-live="polite" className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading… {uploadProgress}%
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-blue transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {localError && (
        <p className="text-sm text-red-600 flex items-center gap-1" role="alert">
          <AlertCircle className="w-4 h-4" /> {localError}
        </p>
      )}

      {status && (
        <div
          role="status"
          aria-live="polite"
          className={`flex items-start gap-2 p-4 rounded-xl text-sm ${
            parseStatus === "failed"
              ? "bg-red-50 text-red-700"
              : parseStatus === "done"
                ? "bg-emerald-50 text-emerald-800"
                : "bg-blue-50 text-blue-800"
          }`}
        >
          {(parseStatus === "pending" || parseStatus === "processing") && (
            <Loader2 className="w-5 h-5 shrink-0 animate-spin" />
          )}
          {parseStatus === "done" && (
            <CheckCircle2 className="w-5 h-5 shrink-0" />
          )}
          {parseStatus === "failed" && (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{status}</span>
        </div>
      )}

      {profile?.resume?.url && (
        <Button
          type="button"
          variant="outline"
          onClick={() => window.open(profile.resume.url, "_blank", "noopener")}
        >
          View uploaded PDF
        </Button>
      )}
    </div>
  );
}
