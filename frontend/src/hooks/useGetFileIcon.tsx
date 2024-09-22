import {
    FileExcelOutlined,
    FileImageOutlined,
    FileOutlined,
    FilePdfOutlined,
    FilePptOutlined,
    FileTextOutlined,
    FileWordOutlined,
    FileZipOutlined,
} from "@ant-design/icons";

const extList: Record<string, string[]> = {
    image: ["png", "jpg", "jpeg", "gif", "svg"],
    archive: ["zip", "rar", "7z", "iso", "gz", "tar", "bz2", "rpm", "deb"],
    text: ["txt"],
    pdf: ["pdf"],
    word: ["doc", "docx"],
    excel: ["xls", "xlsx"],
    powerpoint: ["ppt", "pptx"],
};

export default function useGetFileIcon(
    fileName: string,
    isLargeIcon?: boolean
) {
    const regex = /(?:\.([^.]+))?$/;
    const ext: string = regex.exec(fileName)?.[1] as string;
    const styleIcon = isLargeIcon ? { fontSize: 36 } : { fontSize: 14 };
    for (const key in extList) {
        if (extList[key].includes(ext)) {
            return getIcon(key, styleIcon);
        }
    }
    return <FileOutlined style={styleIcon} />;
}

function getIcon(key: string, styleIcon: Record<string, number>) {
    switch (key) {
        case "image":
            return <FileImageOutlined style={styleIcon} />;
        case "archive":
            return <FileZipOutlined style={styleIcon} />;
        case "excel":
            return <FileExcelOutlined style={styleIcon} />;
        case "word":
            return <FileWordOutlined style={styleIcon} />;
        case "pdf":
            return <FilePdfOutlined style={styleIcon} />;
        case "powerpoint":
            return <FilePptOutlined style={styleIcon} />;
        case "text":
            return <FileTextOutlined style={styleIcon} />;
        default:
            break;
    }
}
