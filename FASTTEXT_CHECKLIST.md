# FastText Integration - Quick Start Checklist

Copy this checklist and check off each item as you complete it.

## Pre-Deployment

- [ ] **Code Review**
  - [ ] Edge function exists: `supabase/functions/lang-detect/index.ts`
  - [ ] Hook updated: `src/hooks/useVoiceAssistant.ts` uses `detectLanguageServer`
  - [ ] No TypeScript errors: `npm run build` passes
  - [ ] All tests pass: `npm test`

- [ ] **Documentation Review**
  - [ ] Read: `supabase/functions/lang-detect/FASTTEXT_SETUP.md`
  - [ ] Read: `FASTTEXT_INTEGRATION_GUIDE.md` (in project root)
  - [ ] Understand: Architecture diagram in guide

## Local Testing

- [ ] **Environment Setup**
  - [ ] `.env.local` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`
  - [ ] Supabase project initialized: `supabase start`
  - [ ] No errors in startup logs

- [ ] **Edge Function Local Test**
  - [ ] Start edge function: `supabase functions serve lang-detect`
  - [ ] Test endpoint: `curl -X POST http://localhost:54321/functions/v1/lang-detect -H "Content-Type: application/json" -d '{"text":"Hello"}'`
  - [ ] Response received: `{"language":"en","confidence":...}`
  - [ ] Response format correct: language code + confidence number

- [ ] **Test Script**
  - [ ] Run: `node test-lang-detect.js`
  - [ ] All 11 language tests complete
  - [ ] 9+ tests pass (fallback regex is acceptable)

- [ ] **Integration Check**
  - [ ] Run: `npx ts-node scripts/fasttext-integration-check.ts`
  - [ ] All checks pass (or only warnings):
    - [ ] Environment variables ✅
    - [ ] Edge function reachable ✅
    - [ ] Language detection working ✅
    - [ ] Database tables accessible ✅

- [ ] **Voice Assistant Test**
  - [ ] Run: `npm run dev`
  - [ ] App loads without errors
  - [ ] Voice widget appears (bottom-right)
  - [ ] Mic permission works:
    - [ ] Click "Connect" → grants mic permission
    - [ ] Listening state activates (pulsing icon)
  - [ ] Speak English: "Hello, how are you?"
    - [ ] Transcribed in console or widget
    - [ ] Browser console shows: `detectedLanguage: "en"`
    - [ ] AI responds in English
    - [ ] Response spoken aloud
  - [ ] Speak French: "Bonjour, comment ça va?"
    - [ ] Detected as: `detectedLanguage: "fr"`
    - [ ] AI responds in French
  - [ ] Speak Spanish: "Hola, ¿cómo estás?"
    - [ ] Detected as: `detectedLanguage: "es"`
    - [ ] AI responds in Spanish

## Production Deployment

- [ ] **Deploy Edge Function**
  - [ ] Set project ID: `export PROJECT_ID=your_project_id`
  - [ ] Deploy: `supabase deploy --project-id $PROJECT_ID`
  - [ ] Verify success: No errors in output
  - [ ] Check deployment: Visit Supabase dashboard → Functions → lang-detect

- [ ] **Configure (Optional: External FastText Service)**
  - [ ] If using external FastText:
    - [ ] Deploy FastText service (Node.js or Python backend)
    - [ ] Get service URL: `https://your-service.com/detect`
    - [ ] Go to Supabase Dashboard → Settings → API → Secrets
    - [ ] Add secret: `FASTTEXT_SERVICE_URL = https://...`
    - [ ] Verify takes effect (may take 5+ minutes)
  - [ ] If using fallback regex:
    - [ ] Skip this step (edge function will use regex automatically)

- [ ] **Production Test**
  - [ ] Redeploy React app: `npm run build && npm run deploy`
  - [ ] Test in production:
    - [ ] Open: `https://your-app.com`
    - [ ] Voice assistant works
    - [ ] Multiple languages detected correctly
    - [ ] No console errors

## Analytics & Monitoring

- [ ] **Verify Data Collection**
  - [ ] Open Supabase database
  - [ ] Check `messages` table: `language` column populated
  - [ ] Check `conversations` table: `language` field set
  - [ ] Query: `SELECT DISTINCT language FROM messages ORDER BY 1;`
    - [ ] Shows multiple language codes (en, es, fr, etc.)

- [ ] **Admin Dashboard**
  - [ ] Login to admin panel: `https://your-app.com/admin`
  - [ ] Dashboard shows:
    - [ ] Languages Used: > 1
    - [ ] Top Languages chart displays
    - [ ] Recent Conversations show language pairs

- [ ] **Monitor Performance**
  - [ ] Check average response time: < 500ms
  - [ ] Check error rate: < 5%
  - [ ] Monitor edge function logs: `supabase functions logs lang-detect`

## Post-Deployment

- [ ] **User Communication**
  - [ ] Update release notes: "FastText language detection now supports 176 languages"
  - [ ] Inform team: "Multilingual support improved from 11 to 176 languages"
  - [ ] Set up monitoring alerts for edge function errors

- [ ] **Maintenance**
  - [ ] Set up quarterly FastText model updates
  - [ ] Monitor language distribution in analytics
  - [ ] Gather user feedback on accuracy
  - [ ] Document any custom language patterns added

## Rollback Plan

If issues arise:

- [ ] **Disable FastText Service**
  - [ ] Remove `FASTTEXT_SERVICE_URL` secret in Supabase
  - [ ] Edge function automatically falls back to regex
  - [ ] Voice assistant continues working

- [ ] **Rollback Code**
  - [ ] Revert `supabase/functions/lang-detect/` to previous version
  - [ ] Redeploy: `supabase deploy --project-id $PROJECT_ID`
  - [ ] Revert React: Redeploy from previous main branch commit

## Support

- [ ] **Test Failure?**
  - [ ] Check: `supabase functions logs lang-detect`
  - [ ] Verify: `curl http://localhost:54321/functions/v1/lang-detect`
  - [ ] Review: Troubleshooting section in `FASTTEXT_INTEGRATION_GUIDE.md`

- [ ] **Deployment Issue?**
  - [ ] Verify Supabase CLI: `supabase --version`
  - [ ] Check project: `supabase projects list`
  - [ ] Validate function: `supabase functions validate`

---

**Status:** ☐ All items complete → Ready for production

**Completion Date:** ____________

**Completed By:** ____________

**Notes:** ________________________________________
