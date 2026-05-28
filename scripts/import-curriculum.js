const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const sampleFile = path.join(__dirname, "..", "data", "tw-curriculum-sample.json");
const raw = fs.readFileSync(sampleFile, "utf8");
const resources = JSON.parse(raw);

async function run() {
  console.log(`Importing ${resources.length} curriculum resources from ${sampleFile}`);

  const payload = resources.map((entry) => ({
    country_code: entry.country,
    grade: entry.grade,
    subject: entry.subject,
    resource_type: entry.type === "questionBank" ? "question_bank" : entry.type,
    title: entry.title,
    publisher: entry.publisher,
    year: entry.year,
    source_url: entry.sourceUrl,
    license: entry.license,
    file_size_bytes: entry.fileSizeBytes,
    description: entry.description,
    metadata: entry.metadata || {},
    language: entry.language || "zh-TW",
  }));

  const { error, data } = await supabase.from("curriculum_resources").insert(payload);
  if (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }

  console.log(`Imported ${data.length} rows successfully.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
