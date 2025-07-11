import { useState } from 'react';
import { useAddLessonMutation } from '../../services/lessonService';
import { useUploadImageMutation } from '../../services/uploadService';
import { toast } from 'react-hot-toast';

const AddLessonModal = ({ courseId, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [slideFiles, setSlideFiles] = useState([]);

  const [addLesson, { isLoading: isAddingLesson }] = useAddLessonMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadImageMutation();

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') { setPdfFile(file); } 
    else { toast.error('Please select a valid PDF file.'); e.target.value = null; }
  };

  const handleSlidesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) { setSlideFiles(files); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Creating lesson...');
    try {
      let pdfUrl = '';
      let slideUrls = [];

      if (pdfFile) {
        toast.loading('Uploading PDF...', { id: toastId });
        const formData = new FormData();
        formData.append('image', pdfFile);
        const uploadResult = await uploadFile(formData).unwrap();
        pdfUrl = uploadResult.imageUrl;
      }

      if (slideFiles.length > 0) {
        toast.loading(`Uploading ${slideFiles.length} slide(s)...`, { id: toastId });
        const uploadPromises = slideFiles.map(file => {
          const formData = new FormData();
          formData.append('image', file);
          return uploadFile(formData).unwrap();
        });
        const uploadResults = await Promise.all(uploadPromises);
        slideUrls = uploadResults.map(result => result.imageUrl);
      }
      
      toast.loading('Saving lesson details...', { id: toastId });
      const lessonData = { title, content, videoUrl, duration: Number(duration), pdfUrl, slides: slideUrls };
      await addLesson({ courseId, data: lessonData }).unwrap();
      
      toast.success('Lesson added successfully!', { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to add lesson.', { id: toastId });
    }
  };

  const isLoading = isAddingLesson || isUploading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold p-6 border-b">Add New Lesson</h2>
        <form className="p-6 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="add-lesson-title" className="block text-gray-700 font-bold mb-2">Lesson Title</label>
            <input type="text" id="add-lesson-title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="add-lesson-content" className="block text-gray-700 font-bold mb-2">Content/Description</label>
            <textarea id="add-lesson-content" name="content" value={content} onChange={(e) => setContent(e.target.value)} required rows="4" className="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="add-lesson-duration" className="block text-gray-700 font-bold mb-2">Duration (minutes)</label>
            <input type="number" id="add-lesson-duration" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required min="1" className="w-full px-3 py-2 border rounded" />
          </div>
          <p className="text-sm font-semibold text-gray-600 mb-2">Choose ONE content type for this lesson:</p>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <label htmlFor="add-lesson-videoUrl" className="block text-gray-700 font-bold mb-2">Video URL</label>
              <input type="url" id="add-lesson-videoUrl" name="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full px-3 py-2 border rounded" placeholder="https://www.youtube.com/watch?v=..." />
            </div>
            <div className="p-4 border rounded-lg">
              <label htmlFor="add-lesson-pdf" className="block text-gray-700 font-bold mb-2">PDF Document</label>
              <input type="file" id="add-lesson-pdf" name="pdf" onChange={handlePdfChange} accept="application/pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              {pdfFile && <p className="text-xs text-gray-500 mt-1">{pdfFile.name}</p>}
            </div>
            <div className="p-4 border rounded-lg">
              <label htmlFor="add-lesson-slides" className="block text-gray-700 font-bold mb-2">Slideshow Images</label>
              <input type="file" id="add-lesson-slides" name="slides" onChange={handleSlidesChange} accept="image/*" multiple className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
              {slideFiles.length > 0 && <p className="text-xs text-gray-500 mt-1">{slideFiles.length} image(s) selected.</p>}
            </div>
          </div>
        </form>
        <div className="flex justify-end space-x-4 p-6 border-t mt-auto">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">{isLoading ? 'Saving...' : 'Add Lesson'}</button>
        </div>
      </div>
    </div>
  );
};
export default AddLessonModal;