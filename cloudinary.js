'use strict'

const CLOUDINARY_CLOUD_NAME = "vpihpy44";
const CLOUDINARY_UPLOAD_PRESET = "adega_preset";

async function uploadParaCloudinary(arquivo) {
    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const response = await fetch(url, { method: "POST", body: formData });

    if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
    }
