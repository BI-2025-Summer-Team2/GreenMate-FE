import { api } from "./client";

// GeoJSON Type
export interface Point {
  lat: number;
  lng: number;
}

export interface CircleGeoJSON {
  center: Point;
  radius: number; // 미터 단위
}

export interface PolygonGeoJSON {
  points: Point[];
}

export type GeoJSON = CircleGeoJSON | PolygonGeoJSON;

// Request Type
export interface GreenTeamPostCreateRequest {
  title: string;
  content: string;
  locationType: "CIRCLE" | "POLYGON";
  locationGeojson: GeoJSON;
  maxParticipants: number;
  eventDate: string;
  deadlineAt: string;
}

// Response Type
export interface IdResponse {
  id: number;
}

export interface GreenTeamPostSummaryResponse {
  id: number;
  title: string;
  content: string;
  locationType: "CIRCLE" | "POLYGON";
  locationGeojson: GeoJSON;
  maxParticipants: number;
  currentParticipants: number;
  eventDate: string;
  deadlineAt: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorProfileUrl?: string;
  imageUrls: string[];
  likeCount: number;
}

export interface GreenTeamPostDetailResponse {
  id: number;
  title: string;
  content: string;
  locationType: "CIRCLE" | "POLYGON";
  locationGeojson: GeoJSON;
  maxParticipants: number;
  currentParticipants: number;
  eventDate: string;
  deadlineAt: string;
  createdAt: string;
  authorId: number;
  authorName: string;
  authorProfileUrl?: string;
  imageUrls: string[];
  likeCount: number;
}

export interface CursorSliceResponse<T> {
  content: T[];
  hasNext: boolean;
  nextCursor?: number;
}

export interface GreenTeamPostLikeResponse {
  postId: number;
  likeCount: number;
  isLiked: boolean;
}

export async function createGreenTeamPost(
  data: GreenTeamPostCreateRequest,
  images?: File[],
  abortSignal?: AbortSignal,
): Promise<IdResponse> {
  const formData = new FormData();

  // JSON 데이터를 Blob으로 추가 (Content-Type: application/json)
  const jsonBlob = new Blob([JSON.stringify(data)], {
    type: "application/json",
  });
  formData.append("data", jsonBlob);

  // 이미지 파일들 추가 (있는 경우만)
  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api.post<IdResponse>(
    "/v1/green-team-posts",
    formData,
    {
      signal: abortSignal,
    },
  );

  return response.data;
}

// 환경 활동 모집글 목록 조회
export async function getGreenTeamPostList(
  cursorId?: number,
  size: number = 20,
  abortSignal?: AbortSignal,
): Promise<CursorSliceResponse<GreenTeamPostSummaryResponse>> {
  const params = new URLSearchParams();
  if (cursorId) {
    params.append("cursorId", cursorId.toString());
  }
  params.append("size", size.toString());

  const response = await api.get<
    CursorSliceResponse<GreenTeamPostSummaryResponse>
  >(`/v1/green-team-posts?${params.toString()}`, {
    signal: abortSignal,
  });

  return response.data;
}

// 환경 활동 단일 모집글 조회
export async function getGreenTeamPostDetail(
  id: number,
  abortSignal?: AbortSignal,
): Promise<GreenTeamPostDetailResponse> {
  const response = await api.get<GreenTeamPostDetailResponse>(
    `/v1/green-team-posts/${id}`,
    {
      signal: abortSignal,
    },
  );

  return response.data;
}

// 모집글 좋아요 생성
export async function addLikeToGreenTeamPost(
  postId: number,
  abortSignal?: AbortSignal,
): Promise<GreenTeamPostLikeResponse> {
  const response = await api.post<GreenTeamPostLikeResponse>(
    `/v1/green-team-posts/${postId}/likes`,
    {},
    {
      signal: abortSignal,
    },
  );

  return response.data;
}

// 모집글 좋아요 삭제
export async function removeLikeFromGreenTeamPost(
  postId: number,
  abortSignal?: AbortSignal,
): Promise<GreenTeamPostLikeResponse> {
  const response = await api.delete<GreenTeamPostLikeResponse>(
    `/v1/green-team-posts/${postId}/likes`,
    {
      signal: abortSignal,
    },
  );

  return response.data;
}
