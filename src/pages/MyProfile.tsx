import { useUser } from '../hooks/useAuth';
import { useUserProfileById } from '../hooks/useProfiles';
import { useState, useEffect } from 'react';
import Avatar from '../components/Avatar';
import { PageLoading } from '../components/utils/PageLoading';
import { supabaseHelpers } from '../types/supabase.helpers';
import { useUserSkills } from '../hooks/useSkills';
import SkillCard from '../components/SkillCard';
import { Link } from 'react-router-dom';

export default function MyProfile() {
  const { data: authUser } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { data: profile, isLoading } = useUserProfileById(authUser?.id || '');
  const { data: skills, isLoading: skillsLoading } = useUserSkills(
    authUser?.id || ''
  );

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    avatar_url: '',
    skills: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        avatar_url: profile.avatar_url || '',
        skills: profile.skills || '',
        bio: profile.bio || '',
        location: profile.location || ''
      });
    }
  }, [profile]);

  async function handleProfileUpdate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    try {
      const updates = {
        ...formData,
        updated_at: new Date().toISOString()
      };

      const updatedProfile = await supabaseHelpers.update(
        'profiles',
        authUser?.id || '',
        updates
      );
      if (updatedProfile) {
        setSuccess(true);
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    }
  }

  if (isLoading) return <PageLoading />;

  return (
    <div className="container mx-auto w-2/3 px-4 py-8">
      <h1 className="text-2xl font-bold">Your Profile</h1>

      {/* Error/Success messages */}
      {error && (
        <div className="mb-4 rounded bg-red-100 p-2 text-red-700">
          Error: {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded bg-green-100 p-2 text-green-700">
          Profile updated successfully!
        </div>
      )}

      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center">
        <Avatar
          url={profile?.avatar_url || formData.avatar_url}
          size={150}
          storageBucket="avatars"
          userId={authUser?.id}
          onUpload={(url) => {
            setFormData((prev) => ({ ...prev, avatar_url: url }));
          }}
        />
        <h2 className="mt-4 text-xl font-semibold">{profile?.full_name}</h2>
        <p className="text-gray-600">{profile?.username}</p>
        <p className="text-gray-600">{authUser?.email}</p>
      </div>

      {/* Editable Profile Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              className="w-full rounded border p-2 text-black"
            />
          </div>
          <div>
            <label className="mb-1 block">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className="w-full rounded border p-2  text-black"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full rounded border p-2  text-black"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block">Skills</label>
            <input
              type="text"
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="w-full rounded border p-2  text-black"
              placeholder="List your skills separated by commas"
            />
          </div>
          <div>
            <label className="mb-1 block">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full rounded border p-2  text-black"
              placeholder="Enter your location/city"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Update Profile
        </button>
      </form>

      {/* Skills Section */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">Your Skill Posts</h2>
        {skillsLoading ? (
          <PageLoading />
        ) : skills?.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            You haven't posted any skills yet.{' '}
            <Link to="/add-post">Post a Skill</Link>
          </p>
        )}
      </div>
    </div>
  );
}
