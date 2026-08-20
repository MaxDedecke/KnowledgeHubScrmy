import { useCallback, useEffect, useState } from "react";
import { getFiles, uploadFile } from "./api.js";
import AppShell from "./components/AppShell.jsx";
import FileDetail from "./components/FileDetail.jsx";
import FileList from "./components/FileList.jsx";
import Sidebar, { SIDEBAR_STATUS } from "./components/Sidebar.jsx";
import UploadButton from "./components/UploadButton.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card.jsx";

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
  const [uploadSuccess, setUploadSuccess] = useState("");
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const loadFiles = useCallback(async () => {
    setIsError(false);
    setHasInitialLoaded(false);
    try {
      const data = await getFiles();
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

  const handleFileClick = (file) => {
    // Klick-Handler der Sidebar (und der Dateiliste): setzt selectedFileId,
    // wodurch die Hauptansicht die Detailansicht dieser Datei öffnet. Ein
    // erneuter Klick auf die bereits ausgewählte Datei setzt die Auswahl
    // zurück (null) und führt damit zurück zur Startansicht. Auf Mobile
    // schließt die Auswahl zugleich das Off-Canvas-Navigationspanel.
    setSelectedFileId((current) => (current === file.id ? null : file.id));
    setSidebarOpen(false);
  };

  const handleFileSelection = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setSelectedFileName(file.name);
    setUploadError("");
    setUploadSuccess("");
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
      setUploadSuccess("Datei erfolgreich hochgeladen.");
    } catch (err) {
      // Das Backend liefert bei abgelehnten Uploads eine konkrete Meldung
      // (z. B. „Datei ist zu groß…“ oder „Dateityp … ist nicht erlaubt…“) –
      // die zeigen wir unverändert an. Nur bei Netzwerk-/Serverfehlern ohne
      // Meldung greift der generische Fallback.
      setUploadError(
        err instanceof Error && err.message
          ? err.message
          : "Datei konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut."
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const status = deriveListStatus(files, hasInitialLoaded, isError);

  return (
    <AppShell
      sidebarOpen={sidebarOpen}
      onToggleSidebarOpen={setSidebarOpen}
      sidebar={
        <Sidebar
          files={files}
          status={status === LIST_STATUS.success ? SIDEBAR_STATUS.success : status}
          selectedFileId={selectedFileId}
          onSelect={handleFileClick}
          onRetry={loadFiles}
        />
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Willkommen im Knowledge Hub</CardTitle>
          <CardDescription>
            Hier können Sie Dateien hochladen und mit Kommentaren anreichern.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadButton
            selectedFileName={selectedFileName}
            isUploading={isUploading}
            uploadError={uploadError}
            uploadSuccess={uploadSuccess}
            onFileSelected={handleFileSelection}
          />
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
