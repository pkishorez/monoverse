import { getMonorepoInfo } from "~/domain";

export const getOverview = (dirPath: string) => {
  const monorepoInfo = getMonorepoInfo(dirPath);

  return monorepoInfo;
};
