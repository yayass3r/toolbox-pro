import { Client, Account, Databases, OAuthProvider, ID, Query } from 'appwrite';

const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '69f0d73900204f7b5dfc';
const APPWRITE_DATABASE_ID = 'toolbox_pro_db';

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export { OAuthProvider, ID, Query };

// Database & Collection IDs
export const DATABASE_ID = APPWRITE_DATABASE_ID;
export const COLLECTIONS = {
  USERS: 'users',
  NEWSLETTER: 'newsletter',
  SUBSCRIPTIONS: 'subscriptions',
  TOOL_USAGE: 'tool_usage',
} as const;

export default client;
