import type { SubtaskOutput } from '../types/subtask.types';

export const formatMediaName = (data: SubtaskOutput): string => {
  const { vertical, hsid, bsid, hvid, bvid, platform, strategist } = data;
  return `vsid${vertical}_hsid${hsid}_bsid${bsid}_hvid${hvid}_bvid${bvid}_${platform}_${strategist}`;
};

export const formatSubtaskName = (data: SubtaskOutput): string => {
  const { vertical, hsid, bsid, hvid, bvid, platform, strategist } = data;
  return `vsid${vertical}_hsid${hsid}_bsid${bsid}_hvid${hvid}_bvid${bvid}_${platform}_${strategist}`;
};