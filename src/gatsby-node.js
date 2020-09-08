const { fetchContentfulMessages } = require("./fetch-contentful-messages");
const webpack = require("webpack");

let contentfulData = null;

exports.onCreateWebpackConfig = async ({ actions, plugins }, pluginOptions) => {
  const { redirectComponent = null, defaultLanguage } = pluginOptions
  contentfulData = contentfulData || await fetchContentfulMessages(pluginOptions);
  if (!contentfulData.languages.includes(defaultLanguage)) {
    contentfulData.languages.push(defaultLanguage)
  }
  const regex = new RegExp(contentfulData.languages.map(l => l.split("-")[0]).join("|"))
  actions.setWebpackConfig({
    plugins: [
      plugins.define({
        GATSBY_INTL_REDIRECT_COMPONENT_PATH: JSON.stringify(redirectComponent),
      }),
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-relativetimeformat[/\\]dist[/\\]locale-data$/,
        regex
      ),
      new webpack.ContextReplacementPlugin(
        /@formatjs[/\\]intl-pluralrules[/\\]dist[/\\]locale-data$/,
        regex
      ),
    ],
  })
}

exports.onCreatePage = async ({ page, actions }, pluginOptions) => {
  //Exit if the page has already been processed.
  if (typeof page.context.intl === "object") {
    return
  }

  const { createPage, deletePage } = actions
  const {
    defaultLanguage = "en",
    redirect = false,
  } = pluginOptions;

  contentfulData = contentfulData || await fetchContentfulMessages(pluginOptions);

  const generatePage = (routed, language) => {
    const messages = contentfulData.messages[language];
    const newPath = routed ? `/${language}${page.path}` : page.path
    return {
      ...page,
      path: newPath,
      context: {
        ...page.context,
        language,
        intl: {
          language,
          languages: contentfulData.languages,
          messages,
          routed,
          originalPath: page.path,
          redirect,
          defaultLanguage,
        },
      },
    }
  }

  const newPage = generatePage(false, defaultLanguage)
  deletePage(page)
  createPage(newPage)

  contentfulData.languages.forEach(language => {
    const localePage = generatePage(true, language)
    const regexp = new RegExp("/404/?$")
    if (regexp.test(localePage.path)) {
      localePage.matchPath = `/${language}/*`
    }
    createPage(localePage)
  })
}
