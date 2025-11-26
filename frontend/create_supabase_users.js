import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

// --- Configuration ---
const SUPABASE_URL = 'https://hjoreefjryvmewihubut.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqb3JlZWZqcnl2bWV3aWh1YnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTAzNjMsImV4cCI6MjA3OTY2NjM2M30.KZf7EyVhsJa_7vC9hReoLPmw_tl-jVZ5qd1JtR_Udhs';

// --- Initialization ---
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Helper to parse CSV ---
function parseCSV(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());

    return lines.slice(1).map(line => {
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
async function createSupabaseUsers() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const csvPath = path.join(__dirname, 'users.csv');

    console.log(`Reading users from ${csvPath}...`);

    try {
        const users = parseCSV(csvPath);
        console.log(`Found ${users.length} users to process.`);

        for (const user of users) {
            console.log(`\nProcessing: ${user.email} (${user.role})`);

            // Generate a random ID since we aren't using Appwrite
            const fakeUserId = crypto.randomBytes(10).toString('hex');

            try {
                // Create Supabase Entry
                const { error: supabaseError } = await supabase
                    .from('users')
                    .insert([
                        {
                            user_id: fakeUserId,
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
                    console.log(`  ✅ Supabase Profile Created (ID: ${fakeUserId})`);
                }

            } catch (error) {
                console.error(`  ❌ Error: ${error.message}`);
            }
        }

        console.log('\nDone!');

    } catch (error) {
        console.error("Script failed:", error);
    }
}

createSupabaseUsers();
