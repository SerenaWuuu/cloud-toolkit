# TESTING.md: Cloud Toolkit

## Pricing verification (as of Oct 6, 2026)

All prices baked into `js/app.js` (`PRICING`) were confirmed via web search on Oct 6, 2026:

| Figure used | Value | Sources |
|---|---|---|
| BigQuery on-demand | $6.25 / TB scanned, first 1 TB/month free | https://www.holistics.io/blog/best-bigquery-visualization-tools/ ("On-demand pricing: $6.25 per TB of data scanned... The first 1 TB per month is free"); https://futuretweets.com/bigquery-vs-snowflake-vs-redshift-pricing-2026/ ("on-demand analysis price remains $6.25 per TiB scanned"); https://checkthat.ai/brands/bigquery/pricing ("$6.25/TiB on-demand (first 1 TiB/month free)") |
| BigQuery Standard slots | $0.04 / slot-hour | https://www.holistics.io/blog/best-bigquery-visualization-tools/ ("Standard Edition starts at $0.04 per slot-hour"); https://checkthat.ai/brands/bigquery/pricing ("$0.04 to $0.10 per slot-hour") |
| BigQuery active storage | $0.02 / GB / month | https://github.com/jabbala10-bit/fde-playbook/blob/HEAD/notes/09_bigquery_data_architecture.md ("Active storage: $0.02/GB/month") |
| Synapse serverless SQL | $5 / TB of data processed | https://www.epcgroup.net/creating-a-powerbi-serverless-application-for-azure-synapse ("Serverless pools charge $5 per terabyte of data processed"); http://www.techbrothersit.com/2025/05/cost-management-for-serverless-sql-pool.html ("Billed at $5 per TB of data processed") |

The UI shows an "as of Oct 6, 2026" label plus a disclaimer that these are estimates and official pricing pages rule.

## Automated checks (all passing)

- `node --check js/naming.js` and `node --check js/app.js`: OK.
- Naming validation unit tests: **86 pass, 0 fail**. Covers: every check on all 8 resource types (valid names, uppercase rejection, length limits, leading/trailing separator rules, consecutive dots, IP-like bucket names, hyphen rejection for storage/BQ datasets), plus `generate()` output validated clean for 7 prefixes (including empty, 80-char, and symbol-only inputs) across all 8 rules.
- Em-dash scan across html/css/js/md: none found (fixed 6 occurrences during build).
- External dependencies: **none**. No CDN libraries, no web fonts, no API calls. The site is fully self-contained, so there was nothing to curl. (ECharts was intentionally skipped in favor of animated CSS bars.)

## Cost math spot checks

- 20 TB scanned: BigQuery = 19 x $6.25 = $118.75; Synapse = 20 x $5 = $100.00.
- 0.5 TB scanned: BigQuery = $0.00 (free tier covers it); Synapse = $2.50.
- 100 slots: 100 x $0.04 x 730h = $2,920.00/month.
- 2 TB storage: 2 x 1024 x $0.02 = $40.96/month.
- Bubble tea comparison uses $5 USD per cup.

## Still needs human eyes

- Open `index.html` on iPhone Safari: tabs, slider, number inputs, copy button, regenerate button, easter egg (tap the green status dot 5 times).
- Confirm layout at 360px width and on desktop.
- Real-device check after GitHub Pages deploy.
