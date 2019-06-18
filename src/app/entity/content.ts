import {Option} from './option';

export class Content {
  id: number;
  text: string;
  type: number;
  chapter_id: number;
  next_content: number;
  options: Option[];
}
