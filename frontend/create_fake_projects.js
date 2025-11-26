import { createClient } from '@supabase/supabase-js';

// --- Configuration ---
const SUPABASE_URL = 'https://hjoreefjryvmewihubut.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhqb3JlZWZqcnl2bWV3aWh1YnV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwOTAzNjMsImV4cCI6MjA3OTY2NjM2M30.KZf7EyVhsJa_7vC9hReoLPmw_tl-jVZ5qd1JtR_Udhs';

// --- Initialization ---
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// --- Data Generators ---
const TITLES = [
    "Solar Powered Water Purification",
    "AI-Driven Crop Optimization",
    "Biodegradable Packaging from Algae",
    "Urban Vertical Farming Units",
    "Micro-grid Energy Sharing Platform",
    "Ocean Plastic Recycling Drone",
    "Carbon Capture Concrete",
    "Smart Water Leak Detection",
    "Electric Vehicle Battery Recycling",
    "Sustainable Textile Dyeing Process"
];

const PROBLEMS = [
    "Lack of clean drinking water in remote areas.",
    "Inefficient water usage in agriculture leading to scarcity.",
    "Plastic pollution overwhelming marine ecosystems.",
    "High carbon footprint of traditional construction materials.",
    "Energy waste in centralized grid systems.",
    "Excessive chemical runoff from textile industries.",
    "Food insecurity in densely populated urban centers."
];

const SOLUTIONS = [
    "A modular device using solar energy to distill and purify water.",
    "Machine learning algorithms to predict optimal irrigation schedules.",
    "Using invasive algae species to create durable, compostable packaging.",
    "Automated hydroponic towers for high-yield urban food production.",
    "Blockchain-based peer-to-peer energy trading marketplace.",
    "Autonomous drones that identify and collect floating plastic waste.",
    "Injecting CO2 into concrete mix to sequester carbon and increase strength."
];

const SDGS = [1, 2, 6, 7, 9, 11, 12, 13, 14, 15];

function getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomSDGs() {
    const num = Math.floor(Math.random() * 3) + 1; // 1 to 3 tags
    const shuffled = SDGS.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, num);
}

// --- Main Function ---
async function createFakeProjects() {
    console.log("Fetching innovators...");

    try {
        // 1. Get Innovators
        const { data: innovators, error: userError } = await supabase
            .from('users')
            .select('user_id, name')
            .eq('role', 'innovator');

        if (userError) throw userError;

        console.log(`Found ${innovators.length} innovators.`);

        // 2. Create Projects for each
        for (const user of innovators) {
            const numProjects = Math.floor(Math.random() * 4) + 2; // 2 to 5
            console.log(`\nCreating ${numProjects} projects for ${user.name} (${user.user_id})...`);

            const projectsToInsert = [];

            for (let i = 0; i < numProjects; i++) {
                projectsToInsert.push({
                    user_id: user.user_id,
                    title: `${getRandomItem(TITLES)} - ${Math.floor(Math.random() * 1000)}`,
                    description: "A revolutionary project aiming to solve critical climate issues.",
                    original_problem: getRandomItem(PROBLEMS),
                    original_source: "Research & Development",
                    sdg_tags: getRandomSDGs(),
                    solution_plan: getRandomItem(SOLUTIONS),
                    is_public: true // Make them public so investors can see them
                });
            }

            const { error: projectError } = await supabase
                .from('projects')
                .insert(projectsToInsert);

            if (projectError) {
                console.error(`  ❌ Error creating projects: ${projectError.message}`);
            } else {
                console.log(`  ✅ Created ${numProjects} projects.`);
            }
        }

        console.log('\nDone!');

    } catch (error) {
        console.error("Script failed:", error);
    }
}

createFakeProjects();
