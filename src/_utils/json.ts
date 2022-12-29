export const isJson = (val: any) => {
  try {
    val = JSON.stringify(val);
    return val.startsWith('{') && val.endsWith('}');
  } catch (error) {
    return false;
  }
};
