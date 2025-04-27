import { useUserProfileById } from '../hooks/useProfiles';
import { useParams } from 'react-router-dom';
import { PageLoading } from '../components/utils/PageLoading';
import Avatar from '../components/Avatar';
import { useUserSkills } from '../hooks/useSkills';
import SkillCard from '../components/SkillCard';

export default function UserProfile() {
  const { id: userId } = useParams();
  const { data: profile, isLoading } = useUserProfileById(userId || '');
  const { data: skills, isLoading: skillsLoading } = useUserSkills(
    userId || ''
  );

  if (isLoading) return <PageLoading />;
  if (!profile) return <div>User not found</div>;

  return (
    <div className="container mx-auto w-2/3 px-4 py-8">
      <h1 className="text-2xl font-bold">{profile.full_name}'s Profile</h1>

      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center">
        <Avatar
          url={profile.avatar_url}
          size={250}
          storageBucket="avatars"
          userId={userId}
          onUpload={() => {}} // No upload for other users
        />
        <h2 className="mt-4 text-xl font-semibold">{profile.full_name}</h2>
        <p className="text-gray-600">{profile.username}</p>
      </div>

      {/* Read-only Profile Info */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">About</h3>
          <p className="text-gray-200">{profile.bio || 'No bio yet'}</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold">Skills</h3>
          <p className="text-gray-200">
            {profile.skills || 'No skills listed'}
          </p>
        </div>
      </div>

      {/* User's Skill Posts */}
      <div className="mt-12">
        <h2 className="mb-4 text-xl font-bold">
          {profile.full_name}'s Skill Posts
        </h2>
        {skillsLoading ? (
          <PageLoading />
        ) : skills?.length ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {skills.map((skill) => (
              <SkillCard key={skill.id} {...skill} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skill posts yet.</p>
        )}
      </div>
    </div>
  );
}
