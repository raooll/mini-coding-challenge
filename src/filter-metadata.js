const _ = require("lodash");

/*
type Metadata = {
  url: string | null;
  siteName: string | null;
  title: string | null;
  description: string | null;
  keywords: string[] | null;
  author: string | null;
};
*/

/**
 * Removes special characters from a string
 * @param {string} string - The string to remove special characters from
 * @returns {string} - A string with no special characters
 *
 */
function sanitize(string) {
  return string.replace(/[^a-zA-Z0-9 ]/g, "");
}

/**
 * Checks if metadata matches a query
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * @param {Metadata} metadata - A metadata object
 * @param {string[]} queryWords - The array of search query string
 * @returns {boolean} - true: if the metadata has query string, else false
 */
function contains(metadata, queryWords) {
  if (_.isEmpty(queryWords)) {
    return true;
  }

  const searchResultArray = Object.entries(metadata).map(([key, value]) => {
    if (value == null) {
      return false;
    }

    if (key === "keywords") {
      return value.some((keyword) =>
        queryWords.includes(keyword.toLowerCase())
      );
    } else {
      return queryWords.some((word) =>
        sanitize(value).toLowerCase().includes(word)
      );
    }
  });

  return searchResultArray.includes(true);
}

/**
 * Prepares a list of all words combinations to match.
 * @param {string} query : A string query
 * @returns {string[]} : An array of all the query term from the query string
 */
function prepareQueryWords(query) {
  let queryWords = query.split(" ").flatMap((w) => {
    if (w.includes("-")) {
      return w.split("-").concat(w.replace("-", ""));
    } else {
      return w;
    }
  });
  return queryWords.map(sanitize).map(_.lowerCase);
}

/**
 * Filters the given Metadata array to only include the objects that match the given search query.
 * If the search query has multiple words,
 * treat each word as a separate search term to filter by,
 * in addition to gathering results from the overall query.
 * If the search query has special characters,
 * run the query filter with the special characters removed.
 * Can return an empty array if no Metadata objects match the search query.
 * @param {Metadata[]} metadata - An array of Metadata objects
 * @param {string} query - The search query string
 * @returns {Metadata[]} - An array of Metadata objects that match the given search query
 */
export default function filterMetadata(metadata, query) {
  // TODO: delete and replace this with your code

  if (_.isArray(metadata) && _.isString(query)) {
    const queryWords = prepareQueryWords(query);
    return metadata.filter((mdata) => contains(mdata, queryWords));
  } else {
    return [];
  }
}
