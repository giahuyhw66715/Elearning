import axiosPrivate from "../config/axios";

const uploadFile = async (file: string | File) => {
    const response = await axiosPrivate.post(
        "/upload",
        { file },
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );
    return response?.data.file.originalname;
};

const getRandomImage = async () => {
    const response = await axiosPrivate.get(
        "https://api.unsplash.com/photos/random?query=work,study&count=1&client_id=0xxeShiun_PgmOn02cqzTVHKdE-WkFSPMxDQDLTv5iE"
    );
    return response.data[0].urls.full;
};

export { uploadFile, getRandomImage };
