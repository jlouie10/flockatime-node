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

/**
 * Format the role response
 */
function formatRoleResponse(role) {
  return {
    id: role._id,
    created: role.created.getTime(),
    name: role.name,
    privileges: role.privileges,
    updated: role.updated.getTime()
  };
}

/**
 * Format the user response - remove password and salt
 */
function formatUserResponse(user) {
  return {
    id: user._id,
    created: user.created.getTime(),
    description: user.description,
    email: user.email,
    extensions: user.extensions,
    flockalogs: user.flockalogs,
    name: user.name,
    role: user.role,
    sessions: user.sessions,
    status: user.status,
    tokens: user.tokens,
    updated: user.updated.getTime()
  };
}

module.exports = {
  formatQuery,
  formatRoleResponse,
  formatUserResponse
};
