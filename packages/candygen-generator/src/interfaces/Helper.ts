import { HelperDelegate } from 'handlebars';

export interface Helper {
  name: string;
  fn: HelperDelegate;
}
