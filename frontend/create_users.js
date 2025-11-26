import fs from 'fs';
import { Client, Account, ID } from 'appwrite';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Configuration ---
const APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID = '68d984c90022bff5d32e';

const SUPABASE_URL = 'https://hjoreefjryvmewihubut.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqb3JlZWZqcnl2bWV3aWh1YnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTAzNjMsImV4cCI6MjA3OTY2NjM2M30.KZf7EyVhsJa_7vC9hReoLPmw_tl-jVZ5qd1JtR_Udhs';

// --- Initialization ---
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

const account = new Account(client);

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Helper to parse CSV ---
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
        // Handle quotes for interests (simple regex split)
        // This is a basic parser. For complex CSVs, use a library.
        const values = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                values.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        values.push(current.trim());

        return headers.reduce((obj, header, index) => {
            obj[header] = values[index];
            return obj;
        }, {});
    });
}

// --- Main Function ---
async function createUsers() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const csvPath = path.join(__dirname, 'users.csv');

    console.log(`Reading users from ${csvPath}...`);

    try {
        const users = parseCSV(csvPath);
        console.log(`Found ${users.length} users to process.`);

        const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        for (const user of users) {
            console.log(`\nProcessing: ${user.email} (${user.role})`);

            let retries = 3;
            while (retries > 0) {
                try {
                    // 1. Create Appwrite Account
                    const appwriteUser = await account.create(
                        ID.unique(),
                        user.email,
                        user.password,
                        user.name
                    );
                    console.log(`  ✅ Appwrite Account Created: ${appwriteUser.$id}`);

                    // 2. Create Supabase Entry
                    const { error: supabaseError } = await supabase
                        .from('users')
                        .insert([
                            {
                                user_id: appwriteUser.$id,
                                name: user.name,
                                email: user.email,
                                role: user.role,
                                profession: user.profession,
                                interests: user.interests ? user.interests.split(',').map(i => i.trim()) : []
                            }
                        ]);

                    if (supabaseError) {
                        console.error(`  ❌ Supabase Error: ${supabaseError.message}`);
                    } else {
                        console.log(`  ✅ Supabase Profile Created`);
                    }

                    // Success! Wait a bit before next user to be nice to the API
                    await sleep(2000);
                    break;

                } catch (error) {
                    if (error.code === 409) {
                        console.log(`  ⚠️ User already exists in Appwrite.`);
                        break;
                    } else if (error.code === 429) {
                        console.log(`  ⏳ Rate limit hit. Waiting 30 seconds...`);
                        await sleep(30000);
                        retries--;
                    } else {
                        console.error(`  ❌ Error: ${error.message}`);
                        break;
                    }
                }
            }
        }

        console.log('\nDone!');

    } catch (error) {
        console.error("Script failed:", error);
    }
}

createUsers();
