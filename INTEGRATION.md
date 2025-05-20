# 🔗 n8n Integration

## Step 1: Import Workflows
Go to your n8n dashboard and import:
- onboarding-workflow.json
- daily-checkin-workflow.json
- emergency-alert-workflow.json

## Step 2: Set Webhook URLs
Use `POST` webhook node at the start of each flow.
Copy the webhook URL and paste in `index.js` for n8n integration.

## Step 3: Customize Sheets & Family Numbers
Use variables in n8n to map to Google Sheets columns.