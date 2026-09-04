import type { SubtaskOutput } from '../types/subtask.types';

const capitalizeFirstLetter = (value: string): string =>
  value.charAt(0).toUpperCase() + value.slice(1);

export const formatMediaName = (data: SubtaskOutput): string => {
  const { vertical, hsid, bsid, hvid, bvid, platform, strategist } = data;
  return `vsid${vertical}_hsid${capitalizeFirstLetter(hsid)}_bsid${capitalizeFirstLetter(bsid)}_hvid${capitalizeFirstLetter(hvid)}_bvid${capitalizeFirstLetter(bvid)}_${platform}_csid${strategist}`;
};

export const formatSubtaskName = (data: SubtaskOutput): string => {
  const { vertical, hsid, bsid, hvid, bvid, platform, strategist } = data;
  return `vsid${vertical}_hsid${capitalizeFirstLetter(hsid)}_bsid${capitalizeFirstLetter(bsid)}_hvid${capitalizeFirstLetter(hvid)}_bvid${capitalizeFirstLetter(bvid)}_${platform}_csid${strategist}`;
};