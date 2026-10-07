# Cloud Toolkit

Two small tools for two big cloud headaches: estimating your monthly data-warehouse bill, and generating cloud resource names that actually pass validation.

**Live demo:** https://serenawuu.github.io/cloud-toolkit

## Tools

1. **Cost Estimator**: estimate monthly spend for BigQuery on-demand analysis and Azure Synapse serverless SQL pool. Slide the terabytes, compare side by side, and see the damage expressed in bubble teas.
2. **Naming Generator**: pick Azure or GCP, pick a resource type, type a prefix, get a compliant name with live rule-by-rule validation, one-click copy, and a regenerate button.

Everything runs 100% in your browser. No servers, no signups, no tracking.

## Run locally

Just open `index.html` in a browser. No build step, no dependencies.

## Deploy to GitHub Pages

1. Push this repo to GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save. Your site will be live at `https://<username>.github.io/cloud-toolkit` within a minute or two.

## Pricing notes

Prices are baked in as of **Oct 6, 2026** and shown in the UI:

- BigQuery on-demand: **$6.25/TB** scanned (first 1 TB/month free)
- BigQuery Standard slots: **$0.04/slot-hour**
- BigQuery active storage: **$0.02/GB/month**
- Azure Synapse serverless SQL pool: **$5/TB** of data processed

These are estimates. Regions, discounts, and price changes move numbers around, so the official pricing pages always win an argument. See `js/app.js` (`PRICING`) to update.

## License

MIT. See [LICENSE](LICENSE).
