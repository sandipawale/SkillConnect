import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useCreateCourseMutation, useUpdateCourseMutation } from '../services/courseService';
import { useGetCategoriesQuery } from '../services/categoryService';
import { useUploadImageMutation } from '../services/uploadService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { TagsInput } from "react-tag-input-component";

const CreateCoursePage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [tags, setTags] = useState([]);

  const navigate = useNavigate();
  const { data: categoriesData, isLoading: isLoadingCategories, error: categoriesError } = useGetCategoriesQuery();
  const [createCourse, { isLoading: isCreatingCourse }] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [uploadImage] = useUploadImageMutation();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { toast.error('File is too large. Maximum size is 10MB.'); return; }
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) { toast.error('Please select a category.'); return; }
    const toastId = toast.loading('Creating course...');
    try {
      const initialCourseData = { title, description, level, duration: Number(duration), price: Number(price), category, tags };
      const newCourseResult = await createCourse(initialCourseData).unwrap();
      const newCourseId = newCourseResult.data._id;
      if (thumbnail) {
        toast.loading('Uploading thumbnail...', { id: toastId });
        const formData = new FormData();
        formData.append('image', thumbnail);
        const uploadResult = await uploadImage(formData).unwrap();
        await updateCourse({ courseId: newCourseId, data: { thumbnail: uploadResult.imageUrl } }).unwrap();
      }
      toast.success('Course created successfully!', { id: toastId });
      navigate(`/instructor/dashboard`);
    } catch (err) {
      toast.error('Failed to create course.', { id: toastId });
    }
  };

  return (
    <div className="container mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Create New Course</h1>
      {categoriesError ? <Message variant="danger">Could not load categories.</Message> : (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {/* --- THIS IS THE GUARANTEED FIX --- */}
          <div className="mb-4">
            <label htmlFor="thumbnail-create" className="block text-gray-700 font-bold mb-2">Course Thumbnail (Optional)</label>
            <input type="file" id="thumbnail-create" name="image" onChange={handleFileChange} accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {thumbnailPreview && ( <div className="mt-4"> <p className="text-sm font-semibold">Image Preview:</p> <img src={thumbnailPreview} alt="Thumbnail Preview" className="h-40 w-auto rounded-lg object-cover" /> </div> )}
          </div>
          <div className="mb-4">
            <label htmlFor="title-create" className="block text-gray-700 font-bold mb-2">Course Title</label>
            <input type="text" id="title-create" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="description-create" className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea id="description-create" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-3 py-2 border rounded" rows="4"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="tags-create" className="block text-gray-700 font-bold mb-2">Tags</label>
            {/* The TagsInput library does not use a standard input, so it doesn't need an id/htmlFor match */}
            <TagsInput value={tags} onChange={setTags} name="tags" placeHolder="Enter tags and press enter" />
            <p className="text-xs text-gray-500 mt-1">Press enter to add a new tag.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="price-create" className="block text-gray-700 font-bold mb-2">Price (₹)</label>
              <input type="number" id="price-create" name="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded" min="0" step="0.01" />
            </div>
            <div>
              <label htmlFor="duration-create" className="block text-gray-700 font-bold mb-2">Duration (hours)</label>
              <input type="number" id="duration-create" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full px-3 py-2 border rounded" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="category-create" className="block text-gray-700 font-bold mb-2">Category</label>
              {isLoadingCategories ? <Loader /> : ( <select id="category-create" name="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 border rounded bg-white"> <option value="" disabled>Select Category...</option> {categoriesData?.data.map((cat) => ( <option key={cat._id} value={cat._id}>{cat.name}</option> ))} </select> )}
            </div>
            <div>
              <label htmlFor="level-create" className="block text-gray-700 font-bold mb-2">Level</label>
              <select id="level-create" name="level" value={level} onChange={(e) => setLevel(e.target.value)} required className="w-full px-3 py-2 border rounded bg-white"> <option>Beginner</option> <option>Intermediate</option> <option>Advanced</option> <option>All Levels</option> </select>
            </div>
          </div>
          {/* --- END OF FIX --- */}
          <button type="submit" disabled={isCreatingCourse} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 disabled:bg-blue-400">
            {isCreatingCourse ? 'Creating...' : 'Create Course'}
          </button>
        </form>
      )}
    </div>
  );
};
export default CreateCoursePage;