// Image upload utility for venue management
// This simulates uploading images to the assets folder structure

export const uploadVenueImage = (file) => {
  return new Promise((resolve, reject) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      reject(new Error('Please select a valid image file (JPEG, PNG, or WebP)'));
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      reject(new Error('Image file size must be less than 5MB'));
      return;
    }

    // Create a FileReader to process the image
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        // Generate a unique filename based on timestamp and original name
        const timestamp = Date.now();
        const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fileName = `venue_${timestamp}_${cleanFileName}`;
        
        // In a real application, this would upload to a server or cloud storage
        // For now, we'll create a blob URL and simulate the upload process
        const imageUrl = event.target.result;
        
        // Debug logging
        console.log('Image upload - File:', file.name);
        console.log('Image upload - Size:', file.size);
        console.log('Image upload - Type:', file.type);
        console.log('Image upload - Data URL length:', imageUrl.length);
        console.log('Image upload - Data URL starts with:', imageUrl.substring(0, 50));
        
        // Simulate upload delay
        setTimeout(() => {
          // Return the image data that can be used by the venue system
          const result = {
            url: imageUrl, // This would be the actual URL in production
            fileName: fileName,
            originalName: file.name,
            size: file.size,
            type: file.type,
            // For the venues.js system, we'll use the dataURL as the image source
            venueImagePath: imageUrl
          };
          
          console.log('Image upload result:', result);
          resolve(result);
        }, 1000); // Simulate 1 second upload time
        
      } catch (error) {
        console.error('Image upload error:', error);
        reject(new Error('Failed to process image file'));
      }
    };

    reader.onerror = () => {
      console.error('FileReader error');
      reject(new Error('Failed to read image file'));
    };

    // Read the file as data URL
    reader.readAsDataURL(file);
  });
};

export const validateImageFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('Please select an image file');
    return errors;
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    errors.push('Please select a valid image file (JPEG, PNG, or WebP)');
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