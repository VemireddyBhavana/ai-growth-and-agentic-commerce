# API Design Standards & Conventions

## Response Format Standard
All REST API endpoints adhere to the standard envelope:

### Success Response (`2xx`)
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "metadata": {
    "timestamp": "2026-08-28T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```

### Error Response (`4xx`, `5xx`)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request payload",
    "details": [
      {
        "field": "email",
        "issue": "Invalid email address format"
      }
    ],
    "remediation": "Provide a valid email in the payload."
  },
  "metadata": {
    "timestamp": "2026-08-28T12:00:00.000Z",
    "requestId": "req_123456789"
  }
}
```
