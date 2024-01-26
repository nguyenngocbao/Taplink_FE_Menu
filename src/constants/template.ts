import { Option } from '@/types';

export enum MenuTemplate {
  DrinkImage,
  FoodImage,
  NoImage
}

export const MENU_TEMPLATES: Option[] = [
  {
    label: 'Drink Image',
    value: MenuTemplate.DrinkImage
  },
  {
    label: 'Food Image',
    value: MenuTemplate.FoodImage
  },
  {
    label: 'No Image',
    value: MenuTemplate.NoImage
  }
];
