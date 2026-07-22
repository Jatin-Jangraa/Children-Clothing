import { NextRequest, NextResponse } from "next/server";
import { uploadImage, uploadVideo, deleteAsset } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const folder = (formData.get("folder") as string) || "cloth-store/products";
    const type = (formData.get("type") as string) || "image";

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" }, { status: 400 });
    }

    const uploaded = [];

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");
      const dataUri = `data:${file.type};base64,${base64}`;

      let result;
      if (type === "video" || file.type.startsWith("video/")) {
        result = await uploadVideo(dataUri, folder);
      } else {
        result = await uploadImage(dataUri, folder);
      }

      uploaded.push({
        url: result.url,
        publicId: result.publicId,
        name: file.name.replace(/\.[^.]+$/, ""),
      });
    }

    return NextResponse.json({ success: true, data: uploaded });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const publicId = searchParams.get("publicId");
    if (!publicId) {
      return NextResponse.json({ success: false, error: "No publicId provided" }, { status: 400 });
    }
    await deleteAsset(publicId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
