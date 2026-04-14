# SMTP Setup

## 1. Configure environment variables

Add these values to `.env` (do not commit secrets):

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="Prolify <foundersuccess@prolify.co>"
INTERNAL_API_KEY=replace_with_random_secret_for_api_calls
```

## 2. Start app

```bash
npm run dev
```

## 3. Send a test email

```bash
curl -X POST "http://localhost:3000/api/email/send" \
  -H "Content-Type: application/json" \
  -H "x-internal-api-key: replace_with_random_secret_for_api_calls" \
  -d '{
    "to": "you@example.com",
    "subject": "SMTP test from Prolify",
    "text": "This is a test email."
  }'
```

## 4. Send a lifecycle template email

```bash
curl -X POST "http://localhost:3000/api/email/send-template" \
  -H "Content-Type: application/json" \
  -H "x-internal-api-key: replace_with_random_secret_for_api_calls" \
  -d '{
    "to": "you@example.com",
    "templateId": "ONB-01",
    "variables": {
      "first_name": "Founder",
      "profile_url": "https://prolify.co/onboarding"
    }
  }'
```

## Notes

- In production, keep `INTERNAL_API_KEY` set to protect the endpoint.
- Endpoint requires:
  - `to`
  - `subject`
  - `text` or `html`
