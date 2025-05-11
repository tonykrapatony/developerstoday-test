'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/PageContainer';

interface SearchForm {
  query: string;
  cuisine: string;
  maxReadyTime: string;
}

const Home = () => {
  const router = useRouter();
  const [form, setForm] = useState<SearchForm>({ query: '', cuisine: '', maxReadyTime: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleNext = () => {
    const { query, cuisine, maxReadyTime } = form;
    if (query || cuisine || maxReadyTime) {
      router.push(`/recipes?query=${query}&cuisine=${cuisine}&maxReadyTime=${maxReadyTime}`);
    }
  };

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="w-full text-4xl font-bold mb-6 text-center">Recipe Finder</h1>
        <div className="w-80 flex-col flex items-center justify-center">
          <input
            type="text"
            name="query"
            value={form.query}
            onChange={handleChange}
            className="w-full h-10 mb-4 p-2 border border-gray-700 rounded"
            placeholder="Enter recipe name"
          />
          <select
            name="cuisine"
            value={form.cuisine}
            onChange={handleChange}
            className="w-full h-10 mb-4 p-2 border border-gray-700 rounded"
          >
            <option value="">Select Cuisine</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Chinese">Chinese</option>
          </select>
          <input
            type="number"
            name="maxReadyTime"
            value={form.maxReadyTime}
            onChange={handleChange}
            className="w-full h-10 mb-4 p-2 border border-gray-700 rounded"
            placeholder="Max preparation time (min)"
          />
          <button
            onClick={handleNext}
            className="w-40 h-10 p-2 bg-blue-500 text-white rounded disabled:bg-gray-500"
            disabled={!form.query && !form.cuisine && !form.maxReadyTime}
          >
            Next
          </button>
        </div>
      </div>
    </PageContainer>
  );
};

export default Home;
