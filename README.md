# Shoot Director, self-hosted

Inside claude.ai the page can't use your camera, so live mode only works when Shoot Director runs from your own site. Everything else works in both places.

## Put it on Vercel (about 5 minutes)
1. Unzip this folder.
2. In Vercel: Add New > Project > drag in the unzipped folder (or push it to a GitHub repo and import that). No build settings needed.
3. In the project's Settings > Environment Variables add:
   - `ANTHROPIC_API_KEY`: your key from console.anthropic.com (this pays for the AI calls)
   - `SHOOT_PASSCODE`: any word you choose. The app asks for it once on each device, so a stranger who finds the link can't spend your credits.
4. Redeploy, then open the site on your phone. Tap Go live and allow the camera and microphone.

Your voice profile and scripts are saved in each browser, so on a new device use Script > Your voice > paste the profile (Copy profile on the old device).
