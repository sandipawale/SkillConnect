import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useUpdateCourseMutation } from '../../services/courseService';
import { useUploadImageMutation } from '../../services/uploadService';

const EditThumbnailModal = ({ course, onClose }) => {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(course?.thumbnail || '');

  const [updateCourse, { isLoading: isUpdatingCourse }] = useUpdateCourseMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadImageMutation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File is too large. Maximum size is 10MB.');
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!thumbnailFile) {
      toast.error('Please select a new thumbnail image to upload.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('image', thumbnailFile);
      const uploadResult = await uploadImage(formData).unwrap();
      
      const updatedData = { thumbnail: uploadResult.imageUrl };

      await updateCourse({ courseId: course._id, data: updatedData }).unwrap();
      toast.success('Thumbnail updated successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to update thumbnail.');
    }
  };

  const isLoading = isUpdatingCourse || isUploadingImage;

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Update Course Thumbnail</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-thumbnail-upload" className="block text-gray-700 font-bold mb-2">New Thumbnail Image</label>
            <input type="file" id="edit-thumbnail-upload" name="image" onChange={handleFileChange} accept="image/*" required className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {thumbnailPreview && (
              <div className="mt-4 text-center">
                <p className="text-sm font-semibold mb-2">Image Preview:</p>
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-40 w-auto rounded-lg object-cover inline-block" />
              </div>
            )}
          </div>
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
            <button type="submit" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">{isLoading ? 'Uploading...' : 'Update Thumbnail'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditThumbnailModal;