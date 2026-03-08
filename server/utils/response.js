/**
 * Standardized Response Formatter for Controllers
 */

/**
 * Format success response
 * @param {string} message - Success message
 * @param {*} data - Response data
 * @param {Object} meta - Optional metadata (pagination, etc.)
 * @returns {Object} Formatted response
 */
export const formatSuccess = (message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return response;
};

/**
 * Format error response
 * @param {string} message - Error message
 * @param {string} type - Error type
 * @returns {Object} Formatted response
 */
export const formatError = (message, type = 'Error') => {
  return {
    success: false,
    error: message,
    type,
  };
};

/**
 * Format paginated response
 * @param {Array} data - Array of items
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {Object} Formatted response with pagination
 */
export const formatPaginatedResponse = (data, page, limit, total) => {
  const totalPages = Math.ceil(total / limit);

  return {
    success: true,
    data,
    meta: {
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    },
  };
};
