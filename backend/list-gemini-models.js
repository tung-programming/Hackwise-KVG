// List available Gemini models for your API key
require('dotenv').config({ path: '.env.local' });
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  const apiKey = process.env.GEMINI_OCR_KEYS?.split(",")[0]?.trim();
  
  if (!apiKey) {
    console.log("❌ GEMINI_OCR_KEYS not found");
    return;
  }

  console.log("🔍 Discovering available Gemini models...\n");
  console.log(`Using key: ${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}\n`);

  const genAI = new GoogleGenerativeAI(apiKey);

  try {
    // Method 1: Try to list models
    const models = await genAI.listModels();
    
    console.log("✅ Available models for your API key:\n");
    
    const visionModels = [];
    
    for await (const model of models) {
      const supportsVision = model.supportedGenerationMethods?.includes('generateContent');
      const canHandleImages = model.inputTokenLimit && model.inputTokenLimit > 1000;
      
      console.log(`📦 ${model.name}`);
      console.log(`   Methods: ${model.supportedGenerationMethods?.join(', ') || 'N/A'}`);
      
      if (supportsVision) {
        visionModels.push(model.name);
      }
    }
    
    console.log("\n✅ Models that support vision/OCR:");
    if (visionModels.length > 0) {
      visionModels.forEach(m => console.log(`   • ${m}`));
    } else {
      console.log("   Testing common models...");
    }
    
  } catch (error) {
    console.log("⚠️ Could not list models, trying common model names...\n");
  }

  // Method 2: Try common model names
  const commonModels = [
    'gemini-pro-vision',
    'gemini-1.5-pro',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro-latest',
    'gemini-1.5-flash-001',
    'gemini-1.5-pro-001',
    'models/gemini-pro-vision',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro',
  ];

  console.log("\n🧪 Testing common model names:\n");

  for (const modelName of commonModels) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say OK");
      const text = result.response.text();
      
      if (text) {
        console.log(`✅ ${modelName} - WORKS!`);
      }
    } catch (error) {
      console.log(`❌ ${modelName} - ${error.message.substring(0, 100)}`);
    }
  }
}

listModels().catch(console.error);
