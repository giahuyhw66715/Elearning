export default function getFileUrl(file: string) {
    return file.startsWith("https") || file.startsWith("blob:")
        ? file
        : `${import.meta.env.VITE_RESOURSE_URL}/${file}`;
}
