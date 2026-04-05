// Test Gemini OCR connectivity
require('dotenv').config({ path: '.env.local' }); // Load .env.local
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');

console.log("🔍 Testing Gemini OCR Configuration...\n");

// 1. Check environment variables
console.log("📋 Environment Check:");
const ocrKeys = process.env.GEMINI_OCR_KEYS;
console.log("GEMINI_OCR_KEYS found:", ocrKeys ? "✅ YES" : "❌ NO");

if (!ocrKeys) {
  console.log("\n❌ GEMINI_OCR_KEYS is not set!");
  console.log("Please add to backend/.env:");
  console.log('GEMINI_OCR_KEYS="your-key-1,your-key-2"');
  process.exit(1);
}

const keys = ocrKeys.split(",").map(k => k.trim()).filter(k => k.length > 0);
console.log(`Found ${keys.length} key(s)\n`);

// 2. Test each key
async function testKey(key, index) {
  console.log(`\n🔑 Testing Key ${index + 1}:`);
  console.log(`Key preview: ${key.substring(0, 10)}...${key.substring(key.length - 4)}`);
  
  const client = new GoogleGenerativeAI(key);
  const models = ["gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-pro"];
  
  for (const modelName of models) {
    try {
      console.log(`  Testing model: ${modelName}...`);
      const model = client.getGenerativeModel({ model: modelName });
      
      // Simple text test
      const result = await model.generateContent("Say 'OK' if you can read this.");
      const text = result.response.text();
      
      if (text) {
        console.log(`  ✅ ${modelName} works! Response: ${text.substring(0, 50)}`);
        return { key: index + 1, model: modelName, success: true };
      }
    } catch (error) {
      console.log(`  ❌ ${modelName} failed: ${error.message}`);
      
      // Detailed error info
      if (error.status) {
        console.log(`     HTTP Status: ${error.status}`);
      }
      if (error.message.includes("403")) {
        console.log(`     ⚠️ 403 Forbidden - API may be blocked or key lacks permissions`);
      }
      if (error.message.includes("Error fetching")) {
        console.log(`     ⚠️ Network error - check firewall/proxy or internet connectivity`);
      }
    }
  }
  
  return { key: index + 1, success: false };
}

async function main() {
  const results = [];
  
  for (let i = 0; i < keys.length; i++) {
    const result = await testKey(keys[i], i);
    results.push(result);
  }
  
  console.log("\n\n📊 Summary:");
  console.log("=".repeat(50));
  
  const working = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  if (working.length > 0) {
    console.log(`\n✅ ${working.length} working key(s):`);
    working.forEach(r => console.log(`   Key ${r.key} with ${r.model}`));
  }
  
  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length} failed key(s):`);
    failed.forEach(r => console.log(`   Key ${r.key}`));
  }
  
  if (working.length === 0) {
    console.log("\n⚠️ NO WORKING KEYS FOUND!");
    console.log("\nPossible issues:");
    console.log("1. Keys are invalid or expired");
    console.log("2. API access is blocked (firewall/proxy)");
    console.log("3. Generative AI API not enabled in Google Cloud Console");
    console.log("4. Keys don't have permission for these models");
    console.log("\nTo fix:");
    console.log("• Visit: https://aistudio.google.com/app/apikey");
    console.log("• Create new API keys");
    console.log("• Enable 'Generative Language API' in Google Cloud");
  } else {
    console.log("\n✅ At least one key is working - OCR should work!");
  }
}

main().catch(console.error);
