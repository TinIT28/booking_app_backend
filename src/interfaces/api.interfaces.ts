export interface ApiResponse<T> {
  success: boolean; // Thành công hay không
  statusCode: number;
  message: string; // Thông báo cho FE
  data?: T; // Dữ liệu chính
  meta?: any; // Phân trang, tổng số bản ghi...
}
