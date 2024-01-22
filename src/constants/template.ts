import { Option } from '@/types';

export enum MenuTemplate {
  Image,
  NoImage
}

export const MENU_TEMPLATES: Option[] = [
  {
    label: 'Image',
    value: MenuTemplate.Image
  },
  {
    label: 'No Image',
    value: MenuTemplate.NoImage
  }
];
