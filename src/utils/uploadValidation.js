import { message, Upload } from "antd";

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"];
const DOC_EXT = ["pdf", "doc", "docx"];
const MEDIA_EXT = [...IMAGE_EXT, "mp4", "webm", "mov", "mp3", "wav", "pdf"];

const KINDS = {
  image: { label: "an image (JPG, PNG, GIF, WEBP, SVG)", ext: IMAGE_EXT, mime: /^image\//, maxMB: 5 },
  document: { label: "a PDF or Word document", ext: DOC_EXT, mime: /^(application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document))$/, maxMB: 5 },
  attachment: { label: "an image, PDF or Word document", ext: [...IMAGE_EXT, ...DOC_EXT], mime: /^(image\/|application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)$)/, maxMB: 5 },
  media: { label: "an image, audio, video or PDF file", ext: MEDIA_EXT, mime: /^(image|video|audio)\/|^application\/pdf$/, maxMB: 50 },
  any: { label: "a file", ext: null, mime: null, maxMB: 200 },
};

export const validateUploadFile = (file, kind = "image", maxMB) => {
  const rule = KINDS[kind] || KINDS.any;
  const limit = maxMB || rule.maxMB;
  if (!file) return null;
  const name = String(file.name || "");
  const ext = name.includes(".") ? name.split(".").pop().toLowerCase() : "";
  if (rule.ext) {
    const okExt = rule.ext.includes(ext);
    const okMime = !file.type || rule.mime.test(file.type);
    if (!okExt || !okMime) return `${name || "File"} must be ${rule.label}.`;
  }
  if (file.size && file.size > limit * 1024 * 1024) {
    return `${name || "File"} is larger than ${limit}MB.`;
  }
  return null;
};

// Returns an antd Upload `beforeUpload` handler that validates type/size,
// then calls `onAccept(file)` (if given) and keeps the upload manual (false).
export const createBeforeUpload = (kind = "image", onAccept, maxMB) => (file) => {
  const error = validateUploadFile(file, kind, maxMB);
  if (error) {
    message.error(error);
    return Upload.LIST_IGNORE;
  }
  if (onAccept) onAccept(file);
  return false;
};

// Validates a file and shows an error toast when invalid. Returns true if OK.
export const checkUpload = (file, kind = "image", maxMB) => {
  const error = validateUploadFile(file, kind, maxMB);
  if (error) {
    message.error(error);
    return false;
  }
  return true;
};
