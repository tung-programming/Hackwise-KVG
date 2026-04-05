// Test Gemini API with direct fetch to understand the issue
require('dotenv').config({ path: '.env.local' });

async function testGeminiAPI() {
  const apiKey = process.env.GEMINI_OCR_KEYS?.split(",")[0]?.trim();
  
  if (!apiKey) {
    console.log("❌ GEMINI_OCR_KEYS not found");
    return;
  }

  console.log("🔍 Testing Gemini API directly...\n");
  console.log(`Key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  // Test 1: List models with v1 API
  console.log("📋 Test 1: Listing available models (v1 API)...");
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    
    if (response.ok) {
      const data = await response.json();
      console.log("✅ API is reachable!\n");
      console.log("Available models:");
      
      if (data.models && data.models.length > 0) {
        data.models.forEach(model => {
          console.log(`  • ${model.name} (${model.displayName})`);
          if (model.supportedGenerationMethods?.includes('generateContent')) {
            console.log(`    ✅ Supports generateContent (can do OCR)`);
          }
        });
      } else {
        console.log("  ⚠️ No models found");
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ HTTP ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }

  // Test 2: Try simple text generation with v1 API
  console.log("\n📝 Test 2: Simple text generation...");
  const testModels = [
    'gemini-pro',
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'models/gemini-pro',
  ];

  for (const modelName of testModels) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Say OK" }]
            }]
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ ${modelName} - WORKS!`);
        return modelName; // Found a working model!
      } else {
        const errorText = await response.text();
        console.log(`❌ ${modelName} - HTTP ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ ${modelName} - ${error.message.substring(0, 80)}`);
    }
  }

  console.log("\n⚠️ Checking API key status...");
  console.log("Your key might need:");
  console.log("1. Enable 'Generative Language API' in Google Cloud Console");
  console.log("2. Generate a new key from: https://aistudio.google.com/app/apikey");
  console.log("3. Ensure billing is enabled (some models require it)");
}

testGeminiAPI().catch(console.error);
