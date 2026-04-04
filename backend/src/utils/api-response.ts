// Standardized response format
export class ApiResponse {
  static success<T>(data: T, message: string = 'Success') {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(message: string, statusCode: number = 500, errors?: any) {
    return {
      success: false,
      message,
      statusCode,
      errors,
      timestamp: new Date().toISOString(),
    };
  }

  static paginated<T>(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    }
  ) {
    return {
      success: true,
      message: 'Success',
      data,
      pagination,
      timestamp: new Date().toISOString(),
    };
  }
}
