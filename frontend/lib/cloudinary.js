// Frontend - Cloudinary Integration Helper
// Configure image/video uploads to Cloudinary

const cloudinaryService = {
  // Upload image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);

      return data.secure_url;
    } catch (error) {
      throw new Error(`Image upload failed: ${error.message}`);
    }
  },

  // Upload video
  uploadVideo: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('resource_type', 'video');
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`,
        { method: 'POST', body: formData }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message);

      return {
        url: data.secure_url,
        thumbnail: data.secure_url.replace('/upload/', '/upload/c_scale,w_300,h_300/') + '.jpg',
      };
    } catch (error) {
      throw new Error(`Video upload failed: ${error.message}`);
    }
  },

  // Get optimized image URL
  getOptimizedImageUrl: (url, options = {}) => {
    const { width = 300, height = 300, quality = 'auto' } = options;
    return url.replace('/upload/', `/upload/q_${quality},w_${width},h_${height}/`);
  },

  // Delete resource
  deleteResource: async (publicId) => {
    // Requires backend authentication
    // Backend handles deletion via Cloudinary API
    return publicId;
  },
};

export default cloudinaryService;
