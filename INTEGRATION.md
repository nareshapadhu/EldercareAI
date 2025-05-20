# 🔗 n8n Integration
# Go to localhost:5678

## Step 1: Import Workflows
Go to your n8n dashboard and import:
- AI Chat Processing workflow.json
- Daily Health Check-in Workflow.json
- Emergency Alert Workflow.json

## Step 2: Set Webhook URLs
Create `POST` webhook node at the start of each flow in n8n dashboard.
Copy the webhook URL and paste in `index.js` for n8n integration.

## Step 3: Customize Sheets & Family Numbers (optional)
Use variables in n8n to map to Google Sheets columns.
