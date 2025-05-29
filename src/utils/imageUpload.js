// Image upload utility for venue management
// This simulates uploading images to the assets folder structure

import { supabase } from '../supabase/supabaseClient';

// Convert image file to WebP using canvas
export const convertImageToWebP = (file, quality = 0.92) => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('File is not an image'));
      return;
    }
    const img = new window.Image();
    const reader = new FileReader();
    reader.onload = (e) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image to WebP'));
              return;
            }
            // Create a new File object for upload
            const webpFile = new File([blob], file.name.replace(/\.(jpg|jpeg|png)$/i, '.webp'), {
              type: 'image/webp',
            });
            resolve(webpFile);
          },
          'image/webp',
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image for conversion'));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
};

// Only allow and upload WebP images
export const uploadVenueImage = async (file) => {
  // Validate file type
  const allowedTypes = ['image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Please select a valid WebP image file (.webp)');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 5MB');
  }

  // Return the file as is for upload
  return {
    file,
    fileName: file.name,
    type: file.type,
    size: file.size,
  };
};

export const validateImageFile = (file) => {
  const errors = [];
  if (!file) {
    errors.push('Please select an image file');
    return errors;
  }
  // Only allow WebP
  if (file.type !== 'image/webp') {
    errors.push('Only WebP images are allowed (.webp)');
  }
  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    errors.push('Image file size must be less than 5MB');
  }
  return errors;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Helper function to create image preview
export const createImagePreview = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
};

// Debug helper to check venue image data
export const debugVenueImage = (venue) => {
  console.log('Debug venue image data:');
  console.log('- Venue name:', venue.name);
  console.log('- Image field:', venue.image);
  console.log('- Image type:', typeof venue.image);
  console.log('- Image length:', venue.image ? venue.image.length : 'N/A');
  console.log('- Is data URL:', venue.image ? venue.image.startsWith('data:') : false);
  if (venue.image && venue.image.startsWith('data:')) {
    console.log('- Data URL format:', venue.image.substring(0, 50) + '...');
  }
};

// Upload a file to Supabase Storage and return the public URL
export async function uploadVenueImageToStorage(file, venueId = null) {
  const fileExt = file.name.split('.').pop();
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileName = `${venueId || Date.now()}-${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  // Upload the file to the 'venue-images' bucket with upsert: true
  let { error } = await supabase.storage
    .from('venue-images')
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  // Get the public URL
  const { data } = supabase.storage
    .from('venue-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
} 