# DineByte Software Upload Guide

This document outlines the process for uploading new software versions to the DineByte distribution system.

## Security Overview
The upload system is protected by a secret password to prevent unauthorized uploads. Only administrators with this password can add or update software files.

## Storage Location
All uploaded software files are stored in the `/storage` directory in the root of the project. This directory is NOT publicly accessible through the web server directly; files are served exclusively through the secure API route.

## How to Upload

### Using `curl` (Recommended for Automation)
You can use the following `curl` command to upload a new version:

```bash
curl -X POST http://your-domain.com/api/upload \
  -F "file=@/path/to/your/software.zip" \
  -F "password=AdminSecureDineByteUpload"
```

### Response Format
On success, the server will return:
```json
{
  "message": "File uploaded successfully.",
  "filename": "software.zip",
  "size": 123456
}
```

## Updating the Website
After uploading a new file, if you want it to be the default download, you may need to update the `filename` in the `handleDownload` function within `app/page.tsx`.

## Troubleshooting
- **401 Unauthorized**: Incorrect upload password.
- **400 Bad Request**: No file provided in the request.
- **500 Internal Server Error**: Check server logs for details (e.g., storage directory permissions).

## Security Best Practices
- **Password Rotation**: Change the `UPLOAD_PASSWORD` in `app/api/upload/route.ts` periodically.
- **File Names**: Use consistent naming conventions (e.g., `dinebyte-v1.0.5.zip`).
- **Log Review**: Check `logs/downloads.log` for download history and failed attempts.
