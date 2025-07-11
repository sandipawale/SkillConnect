import { useState, useEffect } from 'react';
import { useUpdateLessonMutation } from '../../services/lessonService';
import { useUploadImageMutation } from '../../services/uploadService';
import { toast } from 'react-hot-toast';

const EditLessonModal = ({ lesson, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [pdfFile, setPdfFile] = useState(null);

  const [updateLesson, { isLoading: isUpdatingLesson }] = useUpdateLessonMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadImageMutation();

  useEffect(() => {
    if (lesson) {
      setTitle(lesson.title);
      setContent(lesson.content);
      setVideoUrl(lesson.videoUrl || '');
      setPdfUrl(lesson.pdfUrl || '');
      setDuration(lesson.duration.toString());
    }
  }, [lesson]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') { setPdfFile(file); } 
    else { toast.error('Please select a valid PDF file.'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let newPdfUrl = pdfUrl;
    const toastId = toast.loading('Updating lesson...');
    try {
      if (pdfFile) {
        toast.loading('Uploading new PDF...', { id: toastId });
        const formData = new FormData();
        formData.append('image', pdfFile);
        const uploadResult = await uploadFile(formData).unwrap();
        newPdfUrl = uploadResult.imageUrl;
      }
      
      toast.loading('Saving lesson details...', { id: toastId });
      await updateLesson({ lessonId: lesson._id, data: { title, content, videoUrl, duration: Number(duration), pdfUrl: newPdfUrl } }).unwrap();
      toast.success('Lesson updated successfully!', { id: toastId });
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update lesson.', { id: toastId });
    }
  };

  const isLoading = isUpdatingLesson || isUploading;
  if (!lesson) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        <h2 className="text-2xl font-bold p-6 border-b">Edit Lesson</h2>
        <form className="p-6 overflow-y-auto" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="edit-lesson-title" className="block text-gray-700 font-bold mb-2">Lesson Title</label>
            <input type="text" id="edit-lesson-title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-lesson-content" className="block text-gray-700 font-bold mb-2">Content/Description</label>
            <textarea id="edit-lesson-content" name="content" value={content} onChange={(e) => setContent(e.target.value)} required rows="4" className="w-full px-3 py-2 border rounded"></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="edit-lesson-videoUrl" className="block text-gray-700 font-bold mb-2">Video URL</label>
            <input type="url" id="edit-lesson-videoUrl" name="videoUrl" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="w-full px-3 py-2 border rounded" />
          </div>
          <div className="mb-4">
            <label htmlFor="edit-lesson-pdf" className="block text-gray-700 font-bold mb-2">PDF Document</label>
            <input type="file" id="edit-lesson-pdf" name="pdf" onChange={handleFileChange} accept="application/pdf" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
            {pdfUrl && !pdfFile && <p className="text-xs text-gray-500 mt-1">Current PDF: <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">View</a></p>}
            {pdfFile && <p className="text-xs text-gray-500 mt-1">New PDF: {pdfFile.name}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="edit-lesson-duration" className="block text-gray-700 font-bold mb-2">Duration (minutes)</label>
            <input type="number" id="edit-lesson-duration" name="duration" value={duration} onChange={(e) => setDuration(e.target.value)} required min="1" className="w-full px-3 py-2 border rounded" />
          </div>
        </form>
        <div className="flex justify-end space-x-4 p-6 border-t mt-auto">
          <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancel</button>
          <button type="button" onClick={handleSubmit} disabled={isLoading} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-400">{isLoading ? 'Updating...' : 'Update Lesson'}</button>
        </div>
      </div>
    </div>
  );
};
export default EditLessonModal;