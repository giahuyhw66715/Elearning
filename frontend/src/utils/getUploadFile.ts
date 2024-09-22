import { UploadChangeParam } from "antd/es/upload";

export default function getUploadFile(e: UploadChangeParam) {
    const tempUrl = URL.createObjectURL(e.file as unknown as Blob);
    return {
        tempUrl,
        file: e.file as unknown as File,
    };
}
