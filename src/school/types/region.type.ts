export const Regions = [
  '서울',
  '부산',
  '대구',
  '인천',
  '광주',
  '대전',
  '울산',
] as const;
export type Region = (typeof Regions)[number];
