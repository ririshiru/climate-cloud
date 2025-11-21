import { Client, Account, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('YOUR_APPWRITE_ENDPOINT') // Your Appwrite Endpoint
    .setProject('YOUR_PROJECT_ID');         // Your project ID

export const account = new Account(client);

export { ID };

export default client;
