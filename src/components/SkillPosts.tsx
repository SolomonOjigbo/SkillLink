import SkillCard from './SkillCard';

import { FC } from 'react';

interface Skill {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  user_id: string;
}

export interface SkillPostsProps {
  skills: Skill[];
}

const SkillPosts: FC<SkillPostsProps> = ({ skills }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {skills.map((skill, index) => (
        <SkillCard key={index} {...skill} />
      ))}
    </div>
  );
};
export default SkillPosts;
