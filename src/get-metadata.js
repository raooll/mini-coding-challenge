// Note: Please do not use JSDOM or any other external library/package (sorry)
/*
type Metadata = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  keywords: string[];
  author: string;
};
*/

const _ = require("lodash");

/**
 * Parse regex match results
 * @param {string[]} results
 * @returns {string | null} returns the matched string or null
 */
function parseResult(results) {
  if (results && results.length >= 1) {
    return results[1];
  } else {
    return null;
  }
}

/**
 *  Get title metadata
 * @param {string} htmlString html content in string format
 * @returns {string | null} returns the title from the metadata or null
 */
function getTitle(htmlString) {
  const titleMatches = htmlString.match(/<title[^>]*>([^]*?)<\/title>/i);
  return parseResult(titleMatches);
}

/**
 *  Get url metadata
 * @param {string} htmlString html content in string format
 * @returns {string | null} returns the url from the metadata or null
 */
function getUrl(htmlString) {
  const ogMatches = htmlString.match(
    /<meta[\s]*?property="og:url"[.|\s]*?content="([^]*?)"(.|[\s])*?>/i
  );
  return parseResult(ogMatches);
}

/**
 *  Get site name metadata
 * @param {string} htmlString html content in string format
 * @returns {string | null} returns the siteName from the metadata or null
 */
function getSiteName(htmlString) {
  const matches = htmlString.match(
    /<meta[\s]*?property="og:site_name"[.|\s]*?content="([^]*?)"(.|[\s])*?>/i
  );
  return parseResult(matches);
}

/**
 * Get description metadata
 * @param {string} htmlString html content in string format
 * @returns {string | null} returns the description from the metadata or null
 */
function getDescription(htmlString) {
  const ogMatches = htmlString.match(
    /<meta[\s]*?property="og:description"[.|\s]*?content="([^]*?)"(.|[\s])*?>/i
  );
  const nameMatches = htmlString.match(
    /<meta[\s]*?name="description"[.|\s]*?content="([^]*?)"(.|[\s])*?>/i
  );

  return parseResult(ogMatches) || parseResult(nameMatches);
}

/**
 *  Get Keywords metadata
 * @param {string} htmlString html content in string format
 * @returns {string[] | null} returns the keyword array from the metadata or null
 */
function getKeywords(htmlString) {
  const matches = htmlString.match(
    /<meta[\s]*?name="keywords"[.|\s]*?content="([^]*?)"(.|[\s])*?>/i
  );

  const keywordsString = parseResult(matches);
  if (keywordsString != null) {
    return keywordsString
      .split(",")
      .filter((e) => e)
      .map(_.trim);
  } else {
    return null;
  }
}

/**
 * Get Author metadata
 * @param {string} htmlString html content in string format
 * @returns {string | null} returns the author from the metadata or null
 */
function getAuthor(htmlString) {
  const matches = htmlString.match(
    /<meta[\s]*?name="author"[.|\s]*?content="([^]*?)"(.|[\s])*?>/i
  );
  return parseResult(matches);
}

/**
 * Gets the URL, site name, title, description, keywords, and author info out of the <head> meta tags from a given html string.
 * 1. Get the URL from the <meta property="og:url"> tag.
 * 2. Get the site name from the <meta property="og:site_name"> tag.
 * 3. Get the title from the the <title> tag.
 * 4. Get the description from the <meta property="og:description"> tag or the <meta name="description"> tag.
 * 5. Get the keywords from the <meta name="keywords"> tag and split them into an array.
 * 6. Get the author from the <meta name="author"> tag.
 * If any of the above tags are missing or if the values are empty, then the corresponding value will be null.
 * @param html The complete HTML document text to parse
 * @returns A Metadata object with data from the HTML <head>
 */
export default function getMetadata(html) {
  if (!_.isString(html)) {
    html = "";
  }

  return {
    url: getUrl(html),
    siteName: getSiteName(html),
    title: getTitle(html),
    description: getDescription(html),
    keywords: getKeywords(html),
    author: getAuthor(html),
  };
}
