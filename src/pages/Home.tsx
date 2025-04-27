import { useState, useEffect } from 'react';
import { useSupabaseQuery } from '../hooks/useTypedSupabase';
import Skills from '../components/SkillPosts';
import { PageLoading } from '@ui/utils/PageLoading';
import { useDebounce } from 'use-debounce';

const ITEMS_PER_PAGE = 10;

interface iSkills {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  user_id: string;
}

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [page, setPage] = useState(1);

  // Fetch skills with pagination and search
  const {
    data: skillPosts = [],
    isLoading,
    error
  } = useSupabaseQuery('skills', {
    select: (data) => {
      const filtered = debouncedSearchTerm
        ? data.filter((skill) =>
            skill.title
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase())
          )
        : data;

      return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    },
    queryKey: ['skills', debouncedSearchTerm, page]
  });

  // Reset search and pagination
  const handleReset = () => {
    setSearchTerm('');
    setPage(1);
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearchTerm]);

  if (isLoading) return <PageLoading />;
  if (error)
    return (
      <div className="py-8 text-center text-red-500">
        Error loading skills: {error.message}
      </div>
    );

  const totalSkills = skillPosts.length;
  const totalPages = Math.ceil(totalSkills / ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to SkillLink!</h1>
        <p className="text-xl text-gray-600">
          Explore user skills, add your own, and connect with professionals.
        </p>
      </header>

      <section className="mb-12">
        <div className="mx-auto flex max-w-2xl flex-col gap-4 md:flex-row">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search skills..."
            className="flex-1 rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {searchTerm && (
            <button
              onClick={handleReset}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition hover:bg-gray-300"
            >
              Reset
            </button>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-center text-2xl font-semibold">
          {searchTerm ? 'Search Results' : 'Featured Skills'}
        </h2>
        <p className="mb-8 text-center text-gray-500">
          {searchTerm
            ? `Showing skills matching "${searchTerm}"`
            : 'Browse skills from our community'}
        </p>

        <Skills skills={skillPosts as iSkills[]} />

        {skillPosts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              {searchTerm
                ? 'No skills match your search'
                : 'No skills available yet'}
            </p>
          </div>
        ) : (
          <div className="mt-8 flex justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg bg-gray-200 px-4 py-2 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="flex items-center px-4">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="rounded-lg bg-gray-200 px-4 py-2 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
