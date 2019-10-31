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
 * Format the FlockaLog response
 */
function formatFlockalogResponse(flockalog) {
  return {
    id: flockalog._id,
    created: flockalog.created.getTime(),
    timestamps: flockalog.timestamps,
    updated: flockalog.updated.getTime(),
    user: flockalog.user
  };
}

/**
 * Format the privilege response
 */
function formatPrivilegeResponse(privilege) {
  return {
    id: privilege._id,
    actions: privilege.actions,
    created: privilege.created.getTime(),
    name: privilege.name,
    resource: privilege.resource,
    role: privilege.role,
    scope: privilege.scope,
    updated: privilege.updated.getTime()
  };
}

/**
 * Format the role response
 */
function formatRoleResponse(role) {
  return {
    id: role._id,
    created: role.created.getTime(),
    name: role.name,
    privileges: role.privileges.map(privilege =>
      formatPrivilegeResponse(privilege)
    ),
    updated: role.updated.getTime()
  };
}

/**
 * Format the session response - remove session token and salt
 */
function formatSessionResponse(session) {
  return {
    id: session._id,
    created: session.created.getTime(),
    description: session.description,
    updated: session.updated.getTime(),
    user: session.user
  };
}

/**
 * Format the token response - remove token value and salt
 */
function formatTokenResponse(token) {
  return {
    id: token._id,
    created: token.created.getTime(),
    description: token.description,
    updated: token.updated.getTime(),
    user: token.user
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
    flockalogs: user.flockalogs.map(flockalog =>
      formatFlockalogResponse(flockalog)
    ),
    name: user.name,
    role: user.role,
    sessions: user.sessions.map(session => formatSessionResponse(session)),
    status: user.status,
    tokens: user.tokens.map(token => formatTokenResponse(token)),
    updated: user.updated.getTime()
  };
}

module.exports = {
  formatQuery,
  formatFlockalogResponse,
  formatPrivilegeResponse,
  formatRoleResponse,
  formatSessionResponse,
  formatTokenResponse,
  formatUserResponse
};
