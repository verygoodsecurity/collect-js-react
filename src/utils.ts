import { VGSCollectFieldType } from './types/Field';

const setDefaultName = (() => {
  const uniqueFieldTypes = {};
  return (type: VGSCollectFieldType) => {
    const count = uniqueFieldTypes[type];
    let name = type as string;
    if (!count) {
      uniqueFieldTypes[type] = 1;
    } else {
      name = `${type}-${uniqueFieldTypes[type]++}`;
    }
    return name;
  };
})();

export { setDefaultName };
