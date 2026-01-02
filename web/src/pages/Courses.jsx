import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import CourseCard from '../components/dashboard/CourseCard';
import Loader from '../components/common/Loader';
import api from '../services/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filter !== 'all') {
        params.level = filter;
      }
      const { data } = await api.get('/courses', { params });
      setCourses(data.data.courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Our Courses</h1>
          <p className="text-gray-400 text-lg">
            Choose your learning path and master Forex trading
          </p>
        </div>

        <div className="flex flex-wrap gap-4 justify-center mb-8">
          {['all', 'beginner', 'intermediate', 'advanced'].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                filter === level
                  ? 'bg-primary-500 text-dark-950'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No courses found</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Courses;

