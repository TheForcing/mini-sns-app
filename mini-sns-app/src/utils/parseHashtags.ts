export const extractHashtags = (text: string): string[] => {
  const regex = /#([\p{L}\p{N}_]+)/gu; // 유니코드(한글, 영어, 숫자) 포함
  const matches = text.match(regex) || [];
  return matches.map((tag) => tag.replace("#", "").toLowerCase());
};
