import { Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { Label } from "./label";
import type { Post } from "../mocks/posts";

const PostItem = ({ post }: { post: Post }) => {
  const navigate = useNavigate();

  console.log("PostItem 데이터:", {
    id: post.id,
    participants: post.participants,
    maxParticipants: post.maxParticipants,
    title: post.title,
  });

  const handleDetailView = () => {
    void navigate(`/post/${post.id}`);
  };

  const isRecruitmentComplete =
    post.participants >= post.maxParticipants ||
    new Date(post.endDate) < new Date();

  return (
    <div className="post-item">
      <div className="post-item-title">
        <h2 className="post-item-title-text">{post.title}</h2>
      </div>
      <div className="post-item-content">
        <p className="post-item-description">{post.description}</p>
        <p className="post-item-meta">
          <Calendar size={16} /> {post.date} {post.time}
        </p>
        <p className="post-item-meta">
          <Users size={16} /> 참여 {post.participants || 0}/{post.maxParticipants || 0}명
        </p>
        <div className="post-item-bottom">
          <Label
            className={`post-item-label ${isRecruitmentComplete ? "complete" : "recruiting"}`}
          >
            {isRecruitmentComplete ? "모집 완료" : "모집중"}
          </Label>
          <Button className="post-item-button" onClick={handleDetailView}>
            상세보기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PostItem;
