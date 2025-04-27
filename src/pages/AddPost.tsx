import { useState, useEffect } from 'react';
import { InsertDto, supabaseHelpers } from '../types/supabase.helpers';
import Avatar from '@ui/Avatar';
import { useUser } from '../hooks/useAuth';
import { typedSelect } from '../lib/supabaseClient';

interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string | null;
}

const AddPost = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { data: authUser } = useUser();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    category: '',
    user_id: authUser?.id || null
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await typedSelect('categories');
        if (error) {
          console.error('Error fetching categories:', error);
        } else if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    setSuccess(false);

    try {
      const newSkill: InsertDto<'skills'> = {
        title: formData.title,
        description: formData.description,
        image_url: formData.image_url,
        category: formData.category,
        user_id: authUser?.id,
        created_at: new Date().toISOString()
      };

      await supabaseHelpers.insert('skills', newSkill);
      setSuccess(true);
      setFormData({
        title: '',
        description: '',
        image_url: '',
        category: '',
        user_id: authUser?.id || null
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add skill');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto my-16 max-w-lg flex-1 flex-col overflow-y-scroll rounded-lg bg-white p-6 shadow-md">
      <h1 className="mb-1 text-center text-2xl text-black">Add New Skill</h1>

      {error && (
        <div className="mb-4 rounded bg-red-100 p-2 text-red-700">
          Error: {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded bg-green-100 p-2 text-green-700">
          Skill added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="h-full flex-1 gap-4 space-y-4">
        <div className="rounded-10 mb-4 flex items-center justify-center border-2 border-gray-300">
          <Avatar
            url={formData.image_url}
            size={100}
            storageBucket="skill-images"
            userId={authUser?.id || ''}
            onUpload={(filepath) => {
              setFormData({ ...formData, image_url: filepath });
            }}
          />
        </div>

        <div className="my-16 flex flex-col">
          <label
            htmlFor="title"
            className="flex text-sm font-medium text-gray-700"
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            minLength={3}
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input-accent input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter skill title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={6}
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input-accent input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Describe the skill (optional)"
          />
        </div>

        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input-accent input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Adding...' : 'Add Skill'}
        </button>
      </form>
    </div>
  );
};

export default AddPost;
