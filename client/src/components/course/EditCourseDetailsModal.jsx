import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useUpdateCourseMutation } from '../../services/courseService';
import { useGetCategoriesQuery } from '../../services/categoryService';
import { TagsInput } from "react-tag-input-component"; // <-- IMPORT

const EditCourseDetailsModal = ({ course, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [duration, setDuration] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState([]); // <-- NEW STATE

  const { data: categoriesData } = useGetCategoriesQuery();
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();

  useEffect(() => {
    if (course) {
      setTitle(course.title || '');
      setDescription(course.description || '');
      setLevel(course.level || 'Beginner');
      setCategory(course.category?._id || '');
      setDuration(String(course.duration || ''));
      setPrice(String(course.price || ''));
      setTags(course.tags || []); // Populate existing tags
    }
  }, [course]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedData = { 
        title, description, level, 
        duration: Number(duration), 
        price: Number(price), 
        category,
        tags // <-- ADD TAGS TO SUBMISSION
      };
      await updateCourse({ courseId: course._id, data: updatedData }).unwrap();
      toast.success('Course details updated successfully!');
      onClose();
    } catch (err) {
      toast.error('Failed to update course details.');
    }
  };

  if (!course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold p-6 border-b flex-shrink-0">Edit Course Details</h2>
        <form id="edit-course-form" onSubmit={handleSubmit} className="p-6 overflow-y-auto">
          <div className="mb-4">
            <label htmlFor="edit-course-title" className="block text-gray-700 font-bold mb-2">Course Title</label>
            <input type="text" id="edit-course-title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-course-description" className="block text-gray-700 font-bold mb-2">Description</label>
            <textarea id="edit-course-description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows="4" className="w-full px-3 py-2 border rounded"></textarea>
          </div>
          
          {/* --- NEW TAGS INPUT FIELD --- */}
          <div className="mb-4">
            <label htmlFor="edit-tags" className="block text-gray-700 font-bold mb-2">Tags</label>
            <TagsInput
              value={tags}
              onChange={setTags}
              name="tags"
              placeHolder="Enter tags and press enter"
            />
          </div>
          {/* --- END OF NEW FIELD --- */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="edit-course-price" className="block text-gray-700 font-bold mb-2">Price (₹)</label>
              <input type="number" id="edit-course-price" name="price" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full px-3 py-2 border rounded" min="0" step="0.01" />
            </div>
            <div>
              <label htmlFor="edit-course-duration" className="block text-gray-700 font-bold mb-2">Duration (hours)</label>
              <input type="number" id="edit-course-duration" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required className="w-full px-3 py-2 border rounded" min="0" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-course-category" className="block text-gray-700 font-bold mb-2">Category</label>
              <select id="edit-course-category" name="category" value={category} onChange={(e) => setCategory(e.target.value)} required className="w-full px-3 py-2 border rounded bg-white">
                <option value="" disabled>Select a category</option>
                {categoriesData?.data.map((cat) => ( <option key={cat._id} value={cat._id}>{cat.name}</option> ))}
              </select>
            </div>
            <div>
              <label htmlFor="edit-course-level" className="block text-gray-700 font-bold mb-2">Level</label>
              <select id="edit-course-level" name="level" value={level} onChange={(e) => setLevel(e.target.value)} required className="w-full px-3 py-2 border rounded bg-white">
                <option>Beginner</option> <option>Intermediate</option> <option>Advanced</option> <option>All Levels</option>
              </select>
            </div>
          </div>
        </form>
        <div className="flex justify-end space-x-4 p-6 border-t mt-auto flex-shrink-0">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          <button type="submit" form="edit-course-form" disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">{isLoading ? 'Updating...' : 'Update Course'}</button>
        </div>
      </div>
    </div>
  );
};
export default EditCourseDetailsModal;