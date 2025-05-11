import Image from 'next/image';
import { notFound } from 'next/navigation';

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
}

interface RecipeDetail {
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  extendedIngredients: Ingredient[];
}

const fetchRecipeDetails = async (id: string): Promise<RecipeDetail> => {
  const apiKey = process.env.NEXT_API_KEY;
  if (!apiKey) throw new Error('Missing API key');

  const res = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`, {
    cache: 'force-cache',
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error('Failed to fetch recipe details:', res.status);
    notFound();
  }

  return res.json();
};

export default async function RecipeDetailsPage({ params }: { params:Promise<{ id: string }> }) {
  const  { id } = await params;
  const recipe = await fetchRecipeDetails(id);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>
      <Image src={recipe.image} alt={recipe.title} className="w-full object-cover mb-4" width={500} height={500} />
      <p className="text-gray-600 mb-2">⏱ Time: {recipe.readyInMinutes} min | 🍽 Servings: {recipe.servings}</p>

      <div className="prose prose-sm prose-gray mb-6" dangerouslySetInnerHTML={{ __html: recipe.summary }} />

      <h2 className="text-2xl font-semibold mb-3">Ingredients</h2>
      <ul className="list-disc pl-5">
        {recipe.extendedIngredients.map((ing) => (
          <li key={ing.id}>
            {ing.amount} {ing.unit} {ing.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
