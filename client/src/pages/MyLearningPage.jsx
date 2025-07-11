import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactPlayer from 'react-player/lazy';
import { toast } from 'react-hot-toast';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { pdfjs } from 'react-pdf';
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();

// --- NEW IMPORTS FOR SWIPER ---
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// --- END OF NEW IMPORTS ---

import { useGetLessonsForCourseQuery } from '../services/lessonService';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const MyLearningPage = () => {
  const { courseId } = useParams();
  const [activeLesson, setActiveLesson] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const { data: lessonsData, isLoading, error } = useGetLessonsForCourseQuery(courseId);

  useEffect(() => {
    if (lessonsData?.data?.length > 0 && !activeLesson) {
      setActiveLesson(lessonsData.data[0]);
    }
  }, [lessonsData, activeLesson]);

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  if (error) return <div className="p-8"><Message variant="danger">Could not load course lessons.</Message></div>;
  if (!lessonsData?.data || lessonsData.data.length === 0) {
    return <div className="p-8"><Message>This course does not have any lessons yet.</Message></div>;
  }

  const courseTitle = lessonsData.data[0]?.course?.title || 'Course Lessons';

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <aside className="w-full md:w-1/4 bg-white p-4 overflow-y-auto shadow-lg">
        <div className="mb-4">
          <Link to="/dashboard" className="text-blue-500 hover:text-blue-700 mb-4 inline-block">← Back to My Courses</Link>
          <h2 className="text-xl font-bold mb-2">{courseTitle}</h2>
        </div>
        <hr className="mb-4" />
        <ul>
          {lessonsData.data.map((lesson, index) => (
            <li key={lesson._id} onClick={() => setActiveLesson(lesson)} className={`p-3 mb-2 rounded-lg cursor-pointer flex justify-between items-center ${activeLesson?._id === lesson._id ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}>
              <span><span className="font-semibold">Lesson {index + 1}:</span> {lesson.title}</span>
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto">
        {activeLesson ? (
          <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">{activeLesson.title}</h1>
                <Link to={`/lesson/${courseId}/${activeLesson._id}/tasks`} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">View Tasks →</Link>
            </div>
            {/* --- NEW SLIDESHOW RENDER LOGIC --- */}
            {activeLesson.slides && activeLesson.slides.length > 0 ? (
              <div className="bg-black rounded-lg shadow-xl overflow-hidden">
                <Swiper
                  modules={[Navigation, Pagination, A11y]}
                  spaceBetween={50}
                  slidesPerView={1}
                  navigation
                  pagination={{ clickable: true }}
                  className="h-[70vh]"
                >
                  {activeLesson.slides.map((slideUrl, index) => (
                    <SwiperSlide key={index} className="flex justify-center items-center">
                      <img src={slideUrl} alt={`Slide ${index + 1}`} className="max-w-full max-h-full object-contain" />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : activeLesson.pdfUrl ? (
              <div className="h-[70vh] border rounded-lg overflow-hidden">
                <Worker workerUrl="/pdf.worker.min.js">
                  <Viewer fileUrl={activeLesson.pdfUrl} plugins={[defaultLayoutPluginInstance]} />
                </Worker>
              </div>
            ) : activeLesson.videoUrl ? (
              <div className="aspect-w-16 aspect-h-9 mb-6 rounded-lg overflow-hidden shadow-xl"><ReactPlayer url={activeLesson.videoUrl} width="100%" height="100%" controls={true} className="absolute top-0 left-0" /></div>
            ) : null }
            <div className="prose lg:prose-xl max-w-none bg-white p-6 rounded-lg shadow-md my-6"><p>{activeLesson.content}</p></div>
          </div>
        ) : <p className="text-xl text-gray-500">Select a lesson to begin.</p>}
      </main>
    </div>
  );
};
export default MyLearningPage;