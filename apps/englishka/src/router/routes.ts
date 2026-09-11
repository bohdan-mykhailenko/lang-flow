import React from 'react';
import {
  AlphabetPage,
  meta as alphabetMeta,
} from '@/pages/basics/AlphabetPage';
import {
  ReadingRulesPage,
  meta as readingRulesMeta,
} from '@/pages/basics/ReadingRulesPage';
import {
  PhoneticsPage,
  meta as phoneticsMeta,
} from '@/pages/basics/PhoneticsPage';

export interface RouteMeta {
  title: string;
  folder: string;
  folderSlug: string;
  pageSlug: string;
  path: string;
  component: React.ComponentType;
}

export interface FolderGroup {
  folderSlug: string;
  folderTitle: string;
  pages: RouteMeta[];
}

export const routes: RouteMeta[] = [
  { ...alphabetMeta, component: AlphabetPage },
  { ...readingRulesMeta, component: ReadingRulesPage },
  { ...phoneticsMeta, component: PhoneticsPage },
];

export const folderGroups: FolderGroup[] = [
  {
    folderSlug: 'basics',
    folderTitle: 'Основи',
    pages: routes.filter((r) => r.folderSlug === 'basics'),
  },
];

export const defaultPath = '/basics/alphabet';

export function getRouteByPath(path: string): RouteMeta | undefined {
  return (
    routes.find((r) => r.path === path) ||
    routes.find((r) => r.path === defaultPath)
  );
}
