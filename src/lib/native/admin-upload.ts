import { v2 as cloudinary } from "cloudinary";

type RawUploadOptions = {
  folder: FormDataEntryValue | null;
  publicIdPrefix: FormDataEntryValue | null;
  format: FormDataEntryValue | null;
};

export const resolveUploadOptions = (options: RawUploadOptions) => {
  const folder = typeof options.folder === "string" && options.folder.trim() ? options.folder.trim() : "portfolio";
  const publicIdPrefix =
    typeof options.publicIdPrefix === "string" && options.publicIdPrefix.trim()
      ? options.publicIdPrefix.trim()
      : "asset";
  const format = typeof options.format === "string" && options.format.trim() ? options.format.trim() : undefined;

  return {
    folder,
    publicIdPrefix,
    format,
  };
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return cloudinary;
};

export const uploadNativeAdminFile = async (formData: FormData) => {
  const configuredCloudinary = getCloudinaryConfig();
  if (!configuredCloudinary) {
    return null;
  }

  const fileEntry = formData.get("file");
  if (!(fileEntry instanceof File)) {
    throw new Error("No file uploaded");
  }

  const maxBytes = 8 * 1024 * 1024;
  if (fileEntry.size > maxBytes) {
    throw new Error("File too large");
  }

  const arrayBuffer = await fileEntry.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { folder, publicIdPrefix, format } = resolveUploadOptions({
    folder: formData.get("folder"),
    publicIdPrefix: formData.get("publicIdPrefix"),
    format: formData.get("format"),
  });

  const dataUri = `data:${fileEntry.type};base64,${buffer.toString("base64")}`;
  const resourceType = fileEntry.type.startsWith("image/") ? "image" : "raw";

  const uploaded = await configuredCloudinary.uploader.upload(dataUri, {
    folder,
    public_id: `${publicIdPrefix}-${Date.now()}`,
    resource_type: resourceType,
    format,
  });

  return {
    success: true,
    statusCode: 201,
    data: {
      url: uploaded.secure_url,
      optimizedUrl: uploaded.secure_url.replace("/upload/", "/upload/f_auto,q_auto/"),
      publicId: uploaded.public_id,
      resourceType: uploaded.resource_type,
      format: uploaded.format,
      bytes: uploaded.bytes,
      originalFilename: uploaded.original_filename,
    },
  };
};
