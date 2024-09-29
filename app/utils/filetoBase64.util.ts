export const filetoBase64 = (str: string) => {
  return Buffer.from(str).toString('base64');
};
