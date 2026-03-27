// Integration Verification Checklist
// Copy this file into your project at: scripts/fasttext-integration-check.ts
// Run: npx ts-node scripts/fasttext-integration-check.ts

import { createClient } from "@supabase/supabase-js";

interface IntegrationCheckResult {
  name: string;
  status: "✅ PASS" | "⚠️  WARN" | "❌ FAIL";
  details: string;
}

const results: IntegrationCheckResult[] = [];

async function checkIntegration() {
  console.log("🔍 FastText FastText Integration Health Check\n");
  console.log("=".repeat(60) + "\n");

  // 1. Environment Variables
  console.log("1️⃣  Checking Environment Variables...\n");
  
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    results.push({
      name: "Environment Variables",
      status: "❌ FAIL",
      details: "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY",
    });
  } else {
    results.push({
      name: "Environment Variables",
      status: "✅ PASS",
      details: `Supabase URL: ${supabaseUrl.substring(0, 30)}...`,
    });
  }

  // 2. Check if edge function endpoint is reachable
  console.log("2️⃣  Testing Edge Function Endpoint...\n");
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/lang-detect`, {
      method: "OPTIONS",
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
      },
    });

    if (response.ok || response.status === 200) {
      results.push({
        name: "Edge Function Reachability",
        status: "✅ PASS",
        details: "lang-detect endpoint is responding",
      });
    } else {
      results.push({
        name: "Edge Function Reachability",
        status: "⚠️  WARN",
        details: `Status: ${response.status}. Check if function is deployed.`,
      });
    }
  } catch (error: any) {
    results.push({
      name: "Edge Function Reachability",
      status: "❌ FAIL",
      details: `Cannot reach endpoint: ${error.message}`,
    });
  }

  // 3. Test language detection with sample text
  console.log("3️⃣  Testing Language Detection...\n");

  const testText = { text: "Bonjour, comment ça va?" };

  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/lang-detect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${supabaseKey}`,
      },
      body: JSON.stringify(testText),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.language) {
        results.push({
          name: "Language Detection",
          status: "✅ PASS",
          details: `Detected: "${data.language}" for test text. Confidence: ${data.confidence?.toFixed(2) || "N/A"}`,
        });
      } else {
        results.push({
          name: "Language Detection",
          status: "⚠️  WARN",
          details: "Response received but no language detected. Check FASTTEXT_SERVICE_URL secret.",
        });
      }
    } else {
      results.push({
        name: "Language Detection",
        status: "❌ FAIL",
        details: `HTTP ${response.status}: ${await response.text()}`,
      });
    }
  } catch (error: any) {
    results.push({
      name: "Language Detection",
      status: "❌ FAIL",
      details: `Error: ${error.message}`,
    });
  }

  // 4. Check Database Tables
  console.log("4️⃣  Checking Database Schema...\n");

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if conversations table exists
    const { data, error } = await supabase
      .from("conversations")
      .select("id")
      .limit(1);

    if (!error) {
      results.push({
        name: "Conversations Table",
        status: "✅ PASS",
        details: "Table exists and is accessible",
      });
    } else {
      results.push({
        name: "Conversations Table",
        status: "❌ FAIL",
        details: `Error: ${error.message}`,
      });
    }

    // Check if messages table exists
    const { error: msgsError } = await supabase
      .from("messages")
      .select("id")
      .limit(1);

    if (!msgsError) {
      results.push({
        name: "Messages Table",
        status: "✅ PASS",
        details: "Table exists and is accessible",
      });
    } else {
      results.push({
        name: "Messages Table",
        status: "❌ FAIL",
        details: `Error: ${msgsError.message}`,
      });
    }
  } catch (error: any) {
    results.push({
      name: "Database Schema",
      status: "❌ FAIL",
      details: `Error: ${error.message}`,
    });
  }

  // 5. Print Results
  console.log("\n" + "=".repeat(60) + "\n");
  console.log("📋 RESULTS:\n");

  let passCount = 0;
  let warnCount = 0;
  let failCount = 0;

  results.forEach((result) => {
    console.log(`${result.status} ${result.name}`);
    console.log(`   ${result.details}\n`);

    if (result.status === "✅ PASS") passCount++;
    else if (result.status === "⚠️  WARN") warnCount++;
    else failCount++;
  });

  console.log("=".repeat(60));
  console.log(
    `Summary: ${passCount} passed, ${warnCount} warnings, ${failCount} failed\n`
  );

  if (failCount === 0) {
    console.log("✅ FastText integration is ready for voice assistant testing!\n");
    console.log("Next steps:");
    console.log("1. Open React app and test voice assistant");
    console.log("2. Speak in different languages (French, Spanish, etc.)");
    console.log("3. Check browser console for detected languages");
    console.log("4. Verify AI responses are in detected language\n");
  } else {
    console.log(
      "❌ Please fix failures before testing voice assistant.\n"
    );
    console.log("Troubleshooting:");
    console.log("• Edge function not deployed: run `supabase deploy`");
    console.log("• FASTTEXT_SERVICE_URL not set: Add to Supabase secrets in dashboard");
    console.log("• Database tables missing: Run migrations: `supabase migration up`\n");
  }
}

checkIntegration().catch(console.error);
