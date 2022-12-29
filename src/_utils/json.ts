export const isJson = (val: any) => {
  try {
    if (typeof val == 'object') {
      val = JSON.stringify(val).trim();
    }
    return val.startsWith('{') && val.endsWith('}');
  } catch (error) {
    return false;
  }
};
