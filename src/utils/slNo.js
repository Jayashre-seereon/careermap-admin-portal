export const getSerialNumber = (index, pagination) => {
  return (pagination.current - 1) * pagination.pageSize + index + 1;
};