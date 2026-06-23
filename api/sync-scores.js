name: Sync World Cup scores

# Pulls the latest results from wc2026api.com into the pool, server-side.
# Vercel's free (Hobby) cron can only run once per day, so we schedule from
# GitHub Actions instead — this runs even when nobody has the site open.

on:
  schedule:
    # Every 15 minutes (= 96 calls/day, just under the free WC API limit of 100/day).
    # GitHub cron is UTC and may be delayed a few minutes under load — that's fine here.
    - cron: '*/15 * * * *'
  workflow_dispatch: {} # lets you trigger an immediate sync from the Actions tab

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger score sync
        run: |
          echo "Pinging sync endpoint..."
          code=$(curl -s -o /tmp/out.json -w "%{http_code}" \
            "https://www.sridads.com/api/sync-scores?key=${{ secrets.SYNC_SECRET }}")
          echo "HTTP $code"
          cat /tmp/out.json || true
          # Don't fail the whole workflow on a transient hiccup; just report it.
          if [ "$code" != "200" ]; then
            echo "::warning::Sync endpoint returned HTTP $code"
          fi
