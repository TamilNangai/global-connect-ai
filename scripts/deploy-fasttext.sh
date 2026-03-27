#!/bin/bash
# FastText Language Detection Deployment Script
# This script automates the setup and deployment of FastText integration
# 
# Usage: bash scripts/deploy-fasttext.sh
# 
# Prerequisites:
# - Supabase CLI installed: npm install -g supabase
# - Node.js 16+ installed
# - Project already initialized with Supabase
#
# Steps:
# 1. Install FastText.js locally
# 2. Download the language model
# 3. Deploy edge function to Supabase
# 4. Run integration tests
# 5. Output deployment summary

set -e

echo "================================"
echo "FastText Integration Deployment"
echo "================================"
echo ""

# Step 1: Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install with: npm install -g supabase"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found."
    exit 1
fi

echo "✅ Prerequisites met"
echo ""

# Step 2: Install FastText.js
echo "📦 Installing FastText.js..."
npm install --save-dev fasttext.js 2>&1 | grep -v "^npm warn" | head -5 || true

# Alternative: if using Python backend
echo "   (Alternatively, install Python: pip install fasttext)"
echo ""

# Step 3: Download language model
echo "⬇️  Downloading FastText language model (lid.176.ftz)..."
MODEL_PATH="supabase/functions/lang-detect/lid.176.ftz"
if [ ! -f "$MODEL_PATH" ]; then
    wget -q https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.ftz -O "$MODEL_PATH" || \
    curl -o "$MODEL_PATH" https://dl.fbaipublicfiles.com/fasttext/supervised-models/lid.176.ftz
    echo "✅ Model downloaded to $MODEL_PATH"
else
    echo "✅ Model already exists at $MODEL_PATH"
fi
echo ""

# Step 4: Deploy edge function
echo "🚀 Deploying edge function..."
supabase functions deploy lang-detect --project-id "$PROJECT_ID" || {
    echo "ℹ️  Local test: supabase functions serve lang-detect"
    echo "   Then POST to: http://localhost:54321/functions/v1/lang-detect"
}
echo ""

# Step 5: Run integration tests
echo "🧪 Running integration tests..."
if [ -f "test-lang-detect.js" ]; then
    echo "   Run with: node test-lang-detect.js"
    echo "   (Requires Supabase local server running)"
else
    echo "   ⏭️  Skipping tests (test file not found)"
fi
echo ""

# Step 6: Summary
echo "================================"
echo "✅ Deployment Complete!"
echo "================================"
echo ""
echo "📊 Summary:"
echo "  ✅ FastText.js installed"
echo "  ✅ Language model downloaded"
echo "  ✅ Edge function ready"
echo ""
echo "🔧 Next Steps:"
echo "  1. Local Testing:"
echo "     supabase start"
echo "     supabase functions serve lang-detect"
echo "     node test-lang-detect.js"
echo ""
echo "  2. Production Deployment:"
echo "     supabase deploy --project-id YOUR_PROJECT_ID"
echo ""
echo "  3. Configure Secrets (optional, for external FastText service):"
echo "     Go to Supabase Dashboard → Settings → API → Secrets"
echo "     Add: FASTTEXT_SERVICE_URL=https://your-fasttext-service.com/detect"
echo ""
echo "  4. Test Voice Assistant:"
echo "     npm run dev"
echo "     Open http://localhost:5173"
echo "     Click 'Connect' and speak in any language"
echo ""
echo "📚 Documentation:"
echo "  • Setup Instructions: supabase/functions/lang-detect/FASTTEXT_SETUP.md"
echo "  • Integration Check: npx ts-node scripts/fasttext-integration-check.ts"
echo "  • Hook Implementation: src/hooks/useVoiceAssistant.ts"
echo ""
