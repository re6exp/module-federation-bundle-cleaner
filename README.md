# module-federation-bundle-cleaner
<div>
<span>
<a href="https://github.com/re6exp/module-federation-bundle-cleaner/issues" target="_blank" rel="noopener"><img src="https://img.shields.io/github/issues/re6exp/module-federation-bundle-cleaner" data-origin="https://img.shields.io/github/issues/re6exp/module-federation-bundle-cleaner" alt="Git issue"></a> 
<a href="https://github.com/re6exp/module-federation-bundle-cleaner/network/members" target="_blank" rel="noopener"><img src="https://img.shields.io/github/forks/re6exp/module-federation-bundle-cleaner" data-origin="https://img.shields.io/github/forks/re6exp/module-federation-bundle-cleaner" alt="Git forks"></a> 
<a href="https://github.com/re6exp/module-federation-bundle-cleaner/stargazers" target="_blank" rel="noopener"><img src="https://img.shields.io/github/stars/re6exp/module-federation-bundle-cleaner" data-origin="https://img.shields.io/github/stars/re6exp/module-federation-bundle-cleaner" alt="Git star"></a> 
<a href="https://github.com/re6exp/module-federation-bundle-cleaner/blob/main/LICENSE" target="_blank" rel="noopener"><img src="https://img.shields.io/github/license/re6exp/module-federation-bundle-cleaner" data-origin="https://img.shields.io/github/license/re6exp/module-federation-bundle-cleaner" alt="Git MIT"></a> 
</span>
</div>

# Overview
This webpack plugin let you minimize your production bundle of the local application created with [module federation](https://webpack.js.org/concepts/module-federation/) by excluding assets duplication.

# Motivation
When you develop your micro-frontend application as described in the [docs](https://webpack.js.org/concepts/module-federation/) you might come across with a situation when your final bundle built in the production mode contains duplicated set of the assets.

First of them is corresponding to your main goal - the entrypoint for using by the host application, and the second one is the set of the assets which are the product of the local application.

This plugin removes the unnecessary assets which don't belong to the entry point of the federation module you develop. So your final bundle won't contain duplicated set of the assets but only those which will be used by the host application.
# Installation
`yarn add -D module-federation-bundle-cleaner`

# Using the plugin
```javascript
// your webpack production config file:
// ...
      new ModuleFederationBundleCleaner({
          listAssetsToClear: [/* list of js/js.map files */],
          clearEntryPoints: [/* list of entry points to exclude */]
      }),
// ...
```
For the simplest case the use case might be the follow:
```javascript
// your webpack production config file:
// ...
      new ModuleFederationBundleCleaner(),
// ...
```

# Options
- `listAssetsToClear` - an array of assets to clean up from the production build. Default is `['main.js', 'main.js.map', 'main.js.LICENSE.txt']`
- `clearEntryPoints` - an array of the entry points to exclude from the bundle. Default is `['main']`.

## License
This project is licensed under the MIT license, Copyright (c) 2022 re6exp.
For more information see `LICENSE.md`.
