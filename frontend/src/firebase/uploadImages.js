import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase.js'; // adjust path to your firebase config

const uploadImages = async (images) => {
  // Map over the files and upload each one to Firebase Storage
  const uploadPromises = images.map((file) => {
    // Create a unique file path in Storage (using timestamp to avoid collisions)
    const storageRef = ref(storage, `images/${Date.now()}_${file.name}`);
    
    // Upload file and return a promise that resolves with its download URL
    return new Promise((resolve, reject) => {
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Optional: You can track progress here if needed.
        },
        (error) => {
          // Handle unsuccessful uploads
          reject(error);
        },
        async () => {
          // Handle successful uploads on complete
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  });
  
  // Wait for all image uploads to complete and return the array of download URLs
  return Promise.all(uploadPromises);
};

export default uploadImages;
