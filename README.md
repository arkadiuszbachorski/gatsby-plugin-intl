# gatsby-plugin-intl-contentful

Internationalize your Gatsby site using **gatsby-plugin-intl** and **Contentful** together. 

## Why?

**gatsby-plugin-intl** is the very good plugin, unless you might want to get rid of repository-based intl messages. This plugin is a fork, which fetches your messages from Contentful. Be sure to visit [original gatsby-plugin-intl](https://github.com/wiziple/gatsby-plugin-intl) for more information!

## How to use

### Install package

`npm install --save gatsby-plugin-intl-contentful`

### Add a plugin to your gatsby-config.js

```javascript
// In your gatsby-config.js
plugins: [
  {
    resolve: `gatsby-plugin-intl-contentful`,
    options: {
      // default language
      defaultLanguage: `ko`,
      // option to redirect to `/ko` when connecting `/`
      redirect: true,
      // Contentful space credentials
      contentfulSpaceId: "your_contentful_space_id",
      contentfulAccessToken: "your_contentful_access_token",

      // OPTIONAL!
      // Contentful message Content Type id
      messageContentType: "message",
      // Your Contentful message Content Type key field id
      fieldKey: "key", 
      // Your Contentful message Content Type value field id
      fieldValue: "value", 
    },
  },
]
```

### Create Contentful Message Content Model

Create a **Message** Content Model with `message` id, which has two required fields:
* `key` - used as intl object key, for example `callToAction.button`
* `value` - used as intl object value, which might be localised, for example en: `Click me!`, pl: `Kliknij mnie!`

You can find default ids above, but feel free to change them in your `gatsby-config.js` if you want.

#### Example 

![example](https://github.com/arkadiuszbachorski/gatsby-plugin-intl-contentful/blob/master/examples/example.jpg "Example image")

### That's it!

It all done. Now feed your Contentful with i18n data, simply add how many locales you want and build project. No more useless commits!

## How it works

Under the hood it works exactly as [original gatsby-plugin-intl](https://github.com/wiziple/gatsby-plugin-intl). The only difference are two Contentful fetches instead of basing on locale JSON files. Firstly plugin builds languages list based on Contentful locales and then combines it with Messages Content Model. 

## License

MIT &copy; [Arkadiusz Bachorski](https://github.com/arkadiuszbachorski)
