const getError = (err: {
  response?: { data: { message: string } };
  message?: string;
}) =>
  err.response && err.response.data && err.response.data.message
    ? err.response.data.message
    : err.message;

export default getError;
