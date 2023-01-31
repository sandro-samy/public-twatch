import axios from "axios";

const uploadImage = async (e: any, imageField = "image") => {
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/upload`;
  const {
    data: { signature, timestamp },
  } = await axios("/api/admin/cloudinary-sign");
  
  const file = e.target.files[0];
  const formData = new FormData();

  formData.append("file", file);
  formData.append("signature", signature);
  formData.append("timestamp", timestamp);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY!);

  const { data } = await axios.post(url, formData);

  return data;
};

export default uploadImage;
