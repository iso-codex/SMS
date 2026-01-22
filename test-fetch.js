import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tncumkqvnsdepxwyozrr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuY3Vta3F2bnNkZXB4d3lvenJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MTgzNTUsImV4cCI6MjA4NDM5NDM1NX0.LaV-eaCV0vKocr4pQBU7xBBZN4lu8lZEnaSjVRKl6aE';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testFetch() {
    console.log("Testing fetch...");
    try {
        const { data, error } = await supabase
            .from('users')
            .select(`
                *,
                subject_id,
                experience_years,
                qualification,
                joining_date,
                subjects (
                    id,
                    name,
                    code
                )
            `)
            .eq('role', 'teacher');

        if (error) {
            console.error("Fetch Error:", error);
        } else {
            console.log("Fetch Success. Data length:", data.length);
            console.log("Example:", data[0]);
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
}

testFetch();
