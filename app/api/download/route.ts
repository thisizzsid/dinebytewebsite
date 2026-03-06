import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DOWNLOAD_PASSWORD = "Dinebytesoftware.in";
const STORAGE_PATH = path.join(process.cwd(), 'storage');
const LOG_PATH = path.join(process.cwd(), 'logs', 'downloads.log');

function logDownload(status: string, message: string, ip?: string) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] IP: ${ip || 'unknown'} | Status: ${status} | Message: ${message}\n`;
  try {
    fs.appendFileSync(LOG_PATH, logEntry);
  } catch (err) {
    console.error('Failed to write log:', err);
  }
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  
  try {
    const { password, filename } = await req.json();

    if (password !== DOWNLOAD_PASSWORD) {
      logDownload('FAILURE', `Invalid password attempt: ${password}`, ip);
      return NextResponse.json({ error: "Incorrect password. Please try again." }, { status: 401 });
    }

    if (!filename) {
      return NextResponse.json({ error: "Filename is required." }, { status: 400 });
    }

    const filePath = path.join(STORAGE_PATH, filename);

    // Security check to prevent path traversal
    if (!filePath.startsWith(STORAGE_PATH)) {
      logDownload('FAILURE', `Unauthorized path access attempt: ${filename}`, ip);
      return NextResponse.json({ error: "Unauthorized file access." }, { status: 403 });
    }

    if (!fs.existsSync(filePath)) {
      logDownload('FAILURE', `File not found: ${filename}`, ip);
      return NextResponse.json({ error: "File not found." }, { status: 404 });
    }

    const stats = fs.statSync(filePath);
    const fileStream = fs.createReadStream(filePath);

    logDownload('SUCCESS', `File downloaded: ${filename}`, ip);

    // Convert ReadStream to ReadableStream for Next.js response
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
      cancel() {
        fileStream.destroy();
      }
    });

    return new NextResponse(readableStream, {
      headers: {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': 'application/octet-stream',
        'Content-Length': stats.size.toString(),
      },
    });

  } catch (error) {
    console.error('Download error:', error);
    logDownload('ERROR', `Internal server error: ${error instanceof Error ? error.message : 'Unknown'}`, ip);
    return NextResponse.json({ error: "An error occurred while processing your request." }, { status: 500 });
  }
}
