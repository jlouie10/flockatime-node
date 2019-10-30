'use strict';

/**
 * Format the request query to handle comparison query operators
 */
function formatQuery(query) {
  const newQuery = {};

  Object.keys(query).forEach(key => {
    // Remove leading and trailing quotes and apostrophes from query parameter
    const queryParam = query[key]
      .replace(/^\"+|\"+|^\'+|\'+$/g, '')
      .split('/')[0];

    // Replace comparison query operator with MongoDB comparison query operator
    if (
      key.includes('.gt') ||
      key.includes('.gte') ||
      key.includes('.lt') ||
      key.includes('.lte')
    ) {
      const keys = key.split('.');

      // Create a filter based on the field
      newQuery[keys[0]] = {};

      // Parse the comparison query operator and set the value
      newQuery[keys[0]][`$${keys[1]}`] = queryParam;
    } else {
      newQuery[key] = queryParam;
    }
  });

  return newQuery;
}

module.exports = { formatQuery };
