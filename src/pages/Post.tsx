import { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PageNavigation } from "../components/PageNavigation";
import Header from "../components/Header";
import Input from "../components/Input";
import Button from "../components/Button";
import PostItem from "../components/PostItem";
import { Search } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";
import {
  getGreenTeamPostList,
  type GreenTeamPostSummaryResponse,
} from "../api/greenTeamPost";
import type { Post } from "../mocks/posts";

import "../styles/Post.css";

// API 응답을 Mock Post 타입으로 변환하는 유틸리티 함수
const convertApiPostToMockPost = (
  apiPost: GreenTeamPostSummaryResponse,
): Post => {
  return {
    id: apiPost.id,
    publisher_id: apiPost.authorName,
    publisher_image:
      apiPost.authorProfileUrl || "/src/mocks/images/profile.jpg",
    title: apiPost.title,
    description: apiPost.content,
    date: new Date(apiPost.eventDate).toLocaleDateString(),
    time: new Date(apiPost.eventDate).toLocaleTimeString(),
    endDate: apiPost.deadlineAt,
    activityDate: apiPost.eventDate,
    images: apiPost.imageUrls,
    maxParticipants: apiPost.maxParticipants,
    participants: apiPost.currentParticipants ?? 0,
    locationType: apiPost.locationType === "CIRCLE" ? "CIRCLE" : "POLYGON",
    // 타입 불일치 해결 - AreaData 인터페이스로 안전하게 변환
    locationGeojson: apiPost.locationGeojson as Post["locationGeojson"],
    comments: [],
  };
};

const Post = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursorId, setCursorId] = useState<number | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // 게시물 로드
  const loadPosts = useCallback(
    async (reset = false) => {
      if (loading) return;

      setLoading(true);
      setError(null);

      try {
        const response = await getGreenTeamPostList(
          reset ? undefined : cursorId,
          20,
        );

        const convertedPosts = response.content.map(convertApiPostToMockPost);

        if (reset) {
          setPosts(convertedPosts);
        } else {
          setPosts((prev) => [...prev, ...convertedPosts]);
        }

        setHasNext(response.hasNext);
        setCursorId(response.nextCursor);
      } catch (err) {
        setError("게시물을 불러오는 중 오류가 발생했습니다.");
        console.error("Error loading posts:", err);
      } finally {
        setLoading(false);
      }
    },
    [loading, cursorId],
  );

  // 초기 로드
  useEffect(() => {
    void loadPosts(true);
  }, [loadPosts]);

  // 검색어로 필터링
  const filteredPosts = useMemo(() => {
    const lowercasedSearchTerm = debouncedSearchTerm.toLowerCase();
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowercasedSearchTerm) ||
        post.description.toLowerCase().includes(lowercasedSearchTerm),
    );
  }, [posts, debouncedSearchTerm]);

  const handleCreatePost = () => {
    void navigate("/post/create");
  };

  const handleLoadMore = () => {
    if (hasNext && !loading) {
      void loadPosts(false);
    }
  };

  if (error) {
    return (
      <div className="post-container">
        <header className="header">
          <Header />
          <PageNavigation />
        </header>
        <main className="post-main">
          <div className="error-message">
            <p>{error}</p>
            <Button onClick={() => void loadPosts(true)}>다시 시도</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="post-container">
      <header className="header">
        <Header />
        <PageNavigation />
      </header>
      <main className="post-main">
        <div className="post-header">
          <h1 className="post-title">팀 모집</h1>
          <Button className="post-write-button" onClick={handleCreatePost}>
            모집글 작성
          </Button>
        </div>
        <div className="post-search-box">
          <Search size={20} className="post-search-icon" />
          <Input
            type="text"
            placeholder="팀 또는 활동 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="post-search-input"
          />
        </div>
        <div className="post-list">
          {loading && posts.length === 0 ? (
            <div className="loading-message">로딩 중...</div>
          ) : (
            <>
              {filteredPosts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
              {hasNext && filteredPosts.length === posts.length && (
                <div className="load-more-section">
                  <Button onClick={handleLoadMore} disabled={loading}>
                    {loading ? "로딩 중..." : "더 보기"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Post;
