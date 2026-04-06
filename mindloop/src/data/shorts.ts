export interface ShortGame {
  id: string;
  title: string;
  thumbnail: string;
  creator: string;
  likes: number;
  plays: number;
  category: string;
}

const pic = (seed: number) =>
  `https://picsum.photos/seed/${seed}/450/800`;

export const shorts: ShortGame[] = [
  {
    id: "s1",
    title: "탄막 피하기",
    thumbnail: pic(201),
    creator: "김도윤",
    likes: 1240,
    plays: 8700,
    category: "액션",
  },
  {
    id: "s2",
    title: "점프 마스터",
    thumbnail: pic(202),
    creator: "박서연",
    likes: 890,
    plays: 5200,
    category: "플랫폼",
  },
  {
    id: "s3",
    title: "미니 퍼즐",
    thumbnail: pic(203),
    creator: "이하준",
    likes: 2100,
    plays: 12400,
    category: "퍼즐",
  },
  {
    id: "s4",
    title: "리듬 탭",
    thumbnail: pic(204),
    creator: "최유진",
    likes: 3400,
    plays: 18900,
    category: "리듬",
  },
  {
    id: "s5",
    title: "공룡 런",
    thumbnail: pic(205),
    creator: "정민서",
    likes: 670,
    plays: 3800,
    category: "캐주얼",
  },
  {
    id: "s6",
    title: "슬라이스 닌자",
    thumbnail: pic(206),
    creator: "한소율",
    likes: 1560,
    plays: 9100,
    category: "액션",
  },
  {
    id: "s7",
    title: "컬러 매치",
    thumbnail: pic(207),
    creator: "강지호",
    likes: 980,
    plays: 6300,
    category: "퍼즐",
  },
  {
    id: "s8",
    title: "로켓 점프",
    thumbnail: pic(208),
    creator: "윤서아",
    likes: 2800,
    plays: 15600,
    category: "액션",
  },
];
