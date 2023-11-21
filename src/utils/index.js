const currentYear = new Date().getFullYear();

const buildGetSongQuery = (title, performer) => {
  let queryText = 'SELECT id, title, performer FROM songs';
  const titleTerm = `%${title}%`;
  const performerTerm = `%${performer}%`;

  const hasParameters = title !== undefined && performer !== undefined;

  if (hasParameters) {
    queryText += ' WHERE title ILIKE $1 AND performer ILIKE $2';
    return {
      text: queryText,
      values: [titleTerm, performerTerm],
    };
  }

  if (title) {
    queryText += ' WHERE title ILIKE $1';
    return {
      text: queryText,
      values: [titleTerm],
    };
  }

  if (performer) {
    queryText += ' WHERE performer ILIKE $1';
    return {
      text: queryText,
      values: [performerTerm],
    };
  }

  return queryText;
};

module.exports = { buildGetSongQuery, currentYear };
