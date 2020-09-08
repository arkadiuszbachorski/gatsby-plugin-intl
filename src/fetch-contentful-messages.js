const contentful = require('contentful');

exports.fetchContentfulMessages = async ({contentfulSpaceId, contentfulAccessToken, fieldKey = "key", fieldValue = "value", messageContentType = "message"}) => {
  const contentfulClient = contentful.createClient({
    space: contentfulSpaceId,
    accessToken: contentfulAccessToken
  });

  const messages = {};
  let languages = [];

  try {
    const localesResponse = await contentfulClient.getLocales();
    languages = localesResponse.items.map(item => item.code);

    for (let i = 0; i < languages.length; i++) {
      const locale = languages[i];
      const localisedMessages = await contentfulClient.getEntries({
        'content_type': messageContentType,
        'locale': locale,
      });
      messages[locale] = localisedMessages.items.reduce((acc, item) => {
        return {...acc, [item.fields[fieldKey]]: item.fields[fieldValue]}
      }, {});
    }
  } catch(e) {
    console.error(`Error happened when trying to fetch Contentful data. Please check your config and connection. Plugin was looking for: "${messageContentType}" content type, message key field: "${fieldKey}" and value field: ${fieldValue}`)
    throw e;
  }

  return {languages, messages};
}