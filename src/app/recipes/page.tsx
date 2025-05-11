import PageContainer from '@/components/PageContainer';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

interface Recipe {
  id: number;
  title: string;
  image: string;
}

interface Recipes {
  searchQuery: string | undefined;
  cuisine: string | undefined;
  maxReadyTime: string | undefined;
}

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const fetchRecipes = async ({searchQuery, cuisine, maxReadyTime} : Recipes): Promise<Recipe[]> => {
  try {
    const res = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${searchQuery ? 'query=' + searchQuery : ''}&${cuisine ? 'cuisine=' + cuisine : ''}&${maxReadyTime ? 'maxReadyTime=' + maxReadyTime : ''}&apiKey=${process.env.NEXT_API_KEY}`, {
      cache: 'force-cache',
      next: { revalidate: 60 }
    }
    );
    if (!res.ok) {
      throw new Error('Failed to fetch recipes');
    }

    const data = await res.json();
    return data.results;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching data from the API');
  }
};

const Recipes = async ({ searchQuery, cuisine, maxReadyTime }: Recipes) => {
  const recipes = await fetchRecipes({searchQuery, cuisine, maxReadyTime});

  if (!recipes || recipes.length === 0) {
    return <div className="p-4 text-xl">No recipes found.</div>;
  }

  return (
    <PageContainer>
      <div className="p-4">
        <h1 className="text-3xl mb-4">Recipes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="flex flex-col justify-between items-start gap-6 p-4 border rounded shadow-lg cursor-pointer">
              <div className='flex flex-col gap-4 w-full'>
                <Image src={recipe.image} alt={recipe.title} className="w-full" width={100} height={100} />
                <h2 className="text-xl">{recipe.title}</h2>
              </div>
              <Link href={`/recipes/${recipe.id}`}
                className='text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2
               dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700'
              >
                More
              </Link>
            </div>
          ))}
        </div>
      </div>
    </PageContainer>
  );
};

export default async function RecipesPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = Array.isArray(params.query) ? params.query.join(',') : params.query || '';
  const cuisine = Array.isArray(params.cuisine) ? params.cuisine.join(',') : params.cuisine || '';
  const maxReadyTime = Array.isArray(params.maxReadyTime) ? params.maxReadyTime.join(',') : params.maxReadyTime || '';

  return (
    <Suspense fallback={<div className="p-4 text-xl">Loading recipes...</div>}>
      <Recipes
        searchQuery={query}
        cuisine={cuisine}
        maxReadyTime={maxReadyTime}
      />
    </Suspense>
  );
}

