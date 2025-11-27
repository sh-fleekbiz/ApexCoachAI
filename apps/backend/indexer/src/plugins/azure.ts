import fp from 'fastify-plugin';
import { DefaultAzureCredential } from '@azure/identity';
import { BlobServiceClient, type ContainerClient } from '@azure/storage-blob';

export type AzureClients = {
  credential: DefaultAzureCredential;
  blobContainer: ContainerClient;
};

export default fp(
  async (fastify, _options) => {
    const config = fastify.config;

    // Use the current user identity to authenticate with Azure Storage
    // (no secrets needed, just use 'az login' locally, and managed identity when deployed on Azure).
    // If you need to use keys, use separate AzureKeyCredential instances with the keys for each service
    const credential = new DefaultAzureCredential();

    // Set up Azure Blob Storage client
    const blobServiceClient = new BlobServiceClient(
      `https://${config.azureStorageAccount}.blob.core.windows.net`,
      credential,
    );
    const blobContainerClient = blobServiceClient.getContainerClient(config.azureStorageContainer);

    fastify.decorate('azure', {
      credential,
      blobContainer: blobContainerClient,
    });
  },
  {
    name: 'azure',
    dependencies: ['config'],
  },
);

// When using .decorate you have to specify added properties for Typescript
declare module 'fastify' {
  export interface FastifyInstance {
    azure: AzureClients;
  }
}
