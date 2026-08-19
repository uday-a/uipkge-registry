import Story from "../../components/story/Story";
import {
  FileUpload,
  FileUploadContent,
  FileUploadItem,
  FileUploadItemName,
  FileUploadItemSize,
} from "@react-registry/file-upload";
import { UploadCloud, FileText } from "lucide-react";
import { useState } from "react";

export default function FileUploadDemo() {
  const [images, setImages] = useState<File[]>([]);
  const [docs, setDocs] = useState<File[]>([]);
  const [pdfs, setPdfs] = useState<File[]>([]);
  const [customFiles, setCustomFiles] = useState<File[]>([]);

  function removeAt(
    list: File[],
    setList: (files: File[]) => void,
    idx: number,
  ) {
    setList(list.filter((_, i) => i !== idx));
  }

  return (
    <>
      <Story
        title="Default"
        description="Drop zone restricted to image files with click-to-browse fallback."
      >
        <FileUpload
          value={images}
          onValueChange={setImages}
          className="max-w-md"
          accept="image/*"
        >
          <p className="text-sm font-medium">Drag & drop files here</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Or click to browse
          </p>
        </FileUpload>
      </Story>

      <Story
        title="Multiple files"
        description="Multiple uploads with each file rendered using FileUploadItem and remove button."
      >
        <FileUpload
          value={docs}
          onValueChange={setDocs}
          className="max-w-md"
          multiple
          content={
            docs.length ? (
              <FileUploadContent>
                {docs.map((file, i) => (
                  <FileUploadItem
                    key={file.name + i}
                    file={file}
                    onRemove={() => removeAt(docs, setDocs, i)}
                  />
                ))}
              </FileUploadContent>
            ) : undefined
          }
        >
          <p className="text-sm font-medium">Upload documents</p>
          <p className="text-muted-foreground mt-1 text-xs">
            PDF, DOC, or images — multiple allowed
          </p>
        </FileUpload>
      </Story>

      <Story
        title="Accept restriction"
        description="The accept prop limits the picker and renders the rule under the prompt."
      >
        <FileUpload
          value={pdfs}
          onValueChange={setPdfs}
          className="max-w-md"
          accept=".pdf,.doc,.docx"
          multiple
          content={
            pdfs.length ? (
              <FileUploadContent>
                {pdfs.map((file, i) => (
                  <div
                    key={file.name + i}
                    className="bg-muted/50 flex items-center gap-3 rounded-md border p-3"
                  >
                    <FileText className="text-muted-foreground size-8 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <FileUploadItemName>{file.name}</FileUploadItemName>
                      <FileUploadItemSize>
                        {(file.size / 1024).toFixed(1)} KB
                      </FileUploadItemSize>
                    </div>
                  </div>
                ))}
              </FileUploadContent>
            ) : undefined
          }
        >
          <p className="text-sm font-medium">Upload contracts</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Only PDF and Word files accepted
          </p>
        </FileUpload>
      </Story>

      <Story
        title="Disabled"
        description="Pointer events and click-to-browse are suppressed; the dropzone dims to 50%."
      >
        <FileUpload className="max-w-md" disabled>
          <p className="text-sm font-medium">Uploads are paused</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Re-enable in your account settings
          </p>
        </FileUpload>
      </Story>

      <Story
        title="Custom content"
        description="Override the default icon and prompt slots for a branded dropzone."
      >
        <FileUpload
          value={customFiles}
          onValueChange={setCustomFiles}
          className="max-w-md"
          multiple
          icon={<UploadCloud className="text-primary mb-2 size-10" />}
          content={
            customFiles.length ? (
              <FileUploadContent>
                {customFiles.map((file, i) => (
                  <FileUploadItem
                    key={file.name + i}
                    file={file}
                    onRemove={() => removeAt(customFiles, setCustomFiles, i)}
                  />
                ))}
              </FileUploadContent>
            ) : undefined
          }
        >
          <p className="text-sm font-semibold">Drop your assets</p>
          <p className="text-muted-foreground mt-1 text-xs">
            PNG, JPG, or SVG up to 10 MB each
          </p>
        </FileUpload>
      </Story>
    </>
  );
}
