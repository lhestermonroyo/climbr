export const formatColSet = (obj: Object) => {
  const keys = Object.keys(obj);
  const values = Object.values(obj);

  const colSet = keys.map(key => `${key} = ?`).join(', ');

  return {
    colSet,
    values,
  };
};
