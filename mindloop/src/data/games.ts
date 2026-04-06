export interface Game {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  playtime: string;
  type: "shortform" | "longform";
  /** Grid span: "sm" = 1x1, "md" = 1x2 tall, "lg" = 2x2, "wide" = 2x1 */
  size: "sm" | "md" | "lg" | "wide";
}

// Placeholder thumbnails using picsum with fixed seeds for consistency
const pic = (seed: number, w = 400, h = 400) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`;

export const games: Game[] = [
  {
    id: "1",
    title: "서브웨이 런",
    thumbnail: pic(101, 600, 600),
    category: "액션",
    playtime: "2분",
    type: "shortform",
    size: "lg",
  },
  {
    id: "2",
    title: "블록 퍼즐",
    thumbnail: pic(102, 300, 300),
    category: "퍼즐",
    playtime: "3분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "3",
    title: "버블 슈터",
    thumbnail: pic(103, 300, 300),
    category: "캐주얼",
    playtime: "2분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "4",
    title: "픽셀 파이터",
    thumbnail: pic(104, 300, 600),
    category: "액션",
    playtime: "5분",
    type: "shortform",
    size: "md",
  },
  {
    id: "5",
    title: "체스 마스터",
    thumbnail: pic(105, 300, 300),
    category: "전략",
    playtime: "15분",
    type: "longform",
    size: "sm",
  },
  {
    id: "6",
    title: "좀비 서바이벌",
    thumbnail: pic(106, 600, 300),
    category: "액션",
    playtime: "10분",
    type: "longform",
    size: "wide",
  },
  {
    id: "7",
    title: "크로시 로드",
    thumbnail: pic(107, 300, 300),
    category: "캐주얼",
    playtime: "1분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "8",
    title: "타워 디펜스",
    thumbnail: pic(108, 300, 600),
    category: "전략",
    playtime: "20분",
    type: "longform",
    size: "md",
  },
  {
    id: "9",
    title: "탄막 피하기",
    thumbnail: pic(109, 600, 600),
    category: "액션",
    playtime: "2분",
    type: "shortform",
    size: "lg",
  },
  {
    id: "10",
    title: "리듬 러너",
    thumbnail: pic(110, 300, 300),
    category: "캐주얼",
    playtime: "3분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "11",
    title: "스틱맨 배틀",
    thumbnail: pic(111, 600, 300),
    category: "액션",
    playtime: "5분",
    type: "shortform",
    size: "wide",
  },
  {
    id: "12",
    title: "미니 RPG",
    thumbnail: pic(112, 300, 300),
    category: "RPG",
    playtime: "30분+",
    type: "longform",
    size: "sm",
  },
  {
    id: "13",
    title: "공룡 게임",
    thumbnail: pic(113, 300, 300),
    category: "캐주얼",
    playtime: "1분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "14",
    title: "슈팅 마스터",
    thumbnail: pic(114, 300, 300),
    category: "액션",
    playtime: "3분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "15",
    title: "던전 크롤러",
    thumbnail: pic(115, 300, 600),
    category: "RPG",
    playtime: "20분",
    type: "longform",
    size: "md",
  },
  {
    id: "16",
    title: "퍼즐 버블",
    thumbnail: pic(116, 600, 300),
    category: "퍼즐",
    playtime: "4분",
    type: "shortform",
    size: "wide",
  },
  {
    id: "17",
    title: "닌자 점프",
    thumbnail: pic(117, 300, 300),
    category: "액션",
    playtime: "2분",
    type: "shortform",
    size: "sm",
  },
  {
    id: "18",
    title: "매치 3",
    thumbnail: pic(118, 300, 300),
    category: "퍼즐",
    playtime: "3분",
    type: "shortform",
    size: "sm",
  },
];
