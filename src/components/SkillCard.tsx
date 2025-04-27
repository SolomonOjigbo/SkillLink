import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useAuth';

interface SkillCardProps {
  id: number;
  title: string;
  description: string;
  image_url: string;
  category: string;
  created_at: string;
  user_id: string; // Added user_id to props
}

function SkillCard(skill: SkillCardProps) {
  const [isContacting, setIsContacting] = useState(false);
  const [message, setMessage] = useState('');
  const { data: authUser } = useUser();
  const currentUser = authUser?.id;
  const navigate = useNavigate();
  const { title, description, image_url, category, created_at, user_id } =
    skill;

  const handleContact = () => {
    setIsContacting(true);
    setMessage('');
  };

  const handleClose = () => {
    setIsContacting(false);
  };

  const handleViewProfile = () => {
    if (currentUser === user_id) {
      navigate(`/profile`);
    } else {
      navigate(`/profile/${user_id}`);
    }
  };

  return (
    <div className="card border-2 border-gray-400 shadow-white">
      <div className="w-full">
        <img
          src={image_url}
          alt={title}
          onClick={handleViewProfile}
          style={{ cursor: 'pointer' }}
          className="aspect-square w-full object-cover"
        />
      </div>

      <h3 className="text-2xl">{title}</h3>
      <p>Category: {category}</p>

      <p>Description: {description}</p>
      <p>Posted on: {new Date(created_at).toLocaleDateString()}</p>
      <div className="flex gap-2">
        <button onClick={handleContact}>Contact</button>
        <button onClick={handleViewProfile}>View Profile</button>
      </div>
      {isContacting && (
        <div className="contact-modal">
          <p>Contacting {title}...</p>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
          />
          <button onClick={handleClose}>Close</button>
        </div>
      )}
    </div>
  );
}

export default SkillCard;
