import { useCallback, useEffect, useRef, useState } from "react";
import { fetchFiles, uploadFile } from "./api.js";
import AppShell from "./components/AppShell.jsx";
import FileDetail from "./components/FileDetail.jsx";
import FileList from "./components/FileList.jsx";
import { Button } from "./components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card.jsx";
import { Input } from "./components/ui/input.jsx";

export const LIST_STATUS = {
  idle: "idle",
  loading: "loading",
  empty: "empty",
  error: "error",
  success: "success",
};

function deriveListStatus(files, hasInitialLoaded, isError) {
  if (!hasInitialLoaded) return LIST_STATUS.loading;
  if (isError) return LIST_STATUS.error;
  if (files.length === 0) return LIST_STATUS.empty;
  return LIST_STATUS.success;
}

function App() {
  const [files, setFiles] = useState([]);
  const [isError, setIsError] = useState(false);
  const [hasInitialLoaded, setHasInitialLoaded] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [selectedFileId, setSelectedFileId] = useState(null);
  const fileInputRef = useRef(null);

  const loadFiles = useCallback(async () => {
    setIsError(false);
    setHasInitialLoaded(false);
    try {
      const data = await fetchFiles();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setFiles([]);
      setIsError(true);
    } finally {
      setHasInitialLoaded(true);
    }
  }, []);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileClick = (file) => {
    setSelectedFileId(file.id);
  };

  const handleFileSelection = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFileName(file.name);
    setUploadError("");
    setIsUploading(true);
    try {
      const uploaded = await uploadFile(file);
      // Neue Datei ohne Seitenneuladen unmittelbar in die Liste aufnehmen
      // (Backend sortiert neueste zuerst; der Upload antwortet mit dem
      // frisch gespeicherten Metadatensatz).
      setFiles((current) =>
        current.some((entry) => entry.id === uploaded.id)
          ? current
          : [uploaded, ...current]
      );
      setSelectedFileName("");
      setHasInitialLoaded(true);
    } catch {
      setUploadError(
        "Datei konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const status = deriveListStatus(files, hasInitialLoaded, isError);

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle>Willkommen im Knowledge Hub</CardTitle>
          <CardDescription>
            Hier können Sie Dateien hochladen und mit Kommentaren anreichern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              value={selectedFileName}
              onChange={() => {}}
              placeholder={isUploading ? "Wird hochgeladen …" : "Noch keine Datei ausgewählt"}
              readOnly
              aria-label="Ausgewählte Datei"
              className="sm:max-w-sm"
            />
            <Button
              type="button"
              onClick={handleSelectFile}
              disabled={isUploading}
            >
              {isUploading ? "Wird hochgeladen …" : "Datei auswählen"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelection}
              className="hidden"
              aria-hidden="true"
              tabIndex={-1}
            />
          </div>
          {uploadError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              {uploadError}
            </p>
          )}
        </CardContent>
      </Card>

      {selectedFileId === null && (
        <section aria-label="Dateiliste">
          <FileList
            status={status}
            files={files}
            onRetry={loadFiles}
            onSelect={handleFileClick}
          />
        </section>
      )}

      {selectedFileId !== null && (
        <FileDetail
          key={selectedFileId}
          fileId={selectedFileId}
          onBack={() => setSelectedFileId(null)}
        />
      )}
    </AppShell>
  );
}

export default App;
