import { BlobServiceClient } from "@azure/storage-blob";

const connStr = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connStr) {
  throw new Error("AZURE_STORAGE_CONNECTION_STRING is not set");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(connStr);

export function getContainerClient(containerName: string) {
  return blobServiceClient.getContainerClient(containerName);
}

