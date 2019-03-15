const logger = require('../../modules/logger');

const google = require('../../modules/google');

async function googleAuthMiddleware (ctx, next) {
  const auth = google.createConnection();
  auth.setCredentials(ctx.state.user.integrations.google.accessTokens);
  ctx.state.googleAuth = auth;
  await next();
}

async function listCalendars (ctx) {
  const calendar = google.apis.calendar({
    version: 'v3',
    auth: ctx.state.googleAuth
  });
  let request;
  try {
    request = await calendar.calendarList.list(ctx.request.query);
  } catch (e) {
    logger.error(
      `Failed to get GCal calendar list for ${ctx.state.user.rcs_id}: ${e}`
    );
    return ctx.internalServerError(
      'There was an error getting your calendars from Google!'
    );
  }
  ctx.ok({
    calendars: request.data.items
  });
}

module.exports = {
  googleAuthMiddleware,
  listCalendars
};
