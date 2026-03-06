import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const UPLOAD_PASSWORD = "AdminSecureDineByteUpload"; // Secret for upload
const STORAGE_PATH = path.join(process.cwd(), 'storage');

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const password = formData.get('password') as string;

    if (password !== UPLOAD_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized upload attempt." }, { status: 401 });
    }

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(STORAGE_PATH, file.name);

    // Ensure the storage directory exists
    if (!fs.existsSync(STORAGE_PATH)) {
      fs.mkdirSync(STORAGE_PATH, { recursive: true });
    }

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ 
      message: "File uploaded successfully.", 
      filename: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: "An error occurred during upload." }, { status: 500 });
  }
}
