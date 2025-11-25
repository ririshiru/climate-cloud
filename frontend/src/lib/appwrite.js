import { Client, Account, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite Endpoint
    .setProject('68d984c90022bff5d32e');         // Your project ID

export const account = new Account(client);

export { ID };

export default client;
