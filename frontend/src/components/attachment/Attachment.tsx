import { Link } from "react-router-dom";
import getFileUrl from "../../utils/getFileUrl";
import useGetFileIcon from "../../hooks/useGetFileIcon";

type AttachmentProps = {
    url: string;
    fileName: string;
};

const Attachment = ({ url, fileName }: AttachmentProps) => {
    const icon = useGetFileIcon(fileName);

    return (
        <Link
            to={getFileUrl(url)}
            target="_blank"
            download
            className="attachment"
        >
            {icon}
            {fileName}
        </Link>
    );
};

export default Attachment;
