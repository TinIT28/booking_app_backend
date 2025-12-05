export function successResponse<T>(
  data: T,
  message = 'Success',
  statusCode = 200,
) {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
}

export function successListResponse<T>(
  data: T[],
  meta: any,
  message = 'Success',
) {
  return {
    success: true,
    statusCode: 200,
    message,
    data,
    meta,
  };
}
