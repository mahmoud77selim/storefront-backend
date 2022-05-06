import _ from 'lodash';
// import { TextDecoderStream } from 'stream/web'
export default {
  deserialiseCategory(category: string) {
    const newString = this.startCase(category.replace('_', ' '));
    return newString;
  },
  startCase(literal: string) {
    return _.startCase(literal);
  },
  isEmpty(item: unknown) {
    return _.isEmpty(item);
  },
};
