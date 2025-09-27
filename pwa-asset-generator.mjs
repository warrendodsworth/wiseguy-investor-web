// const pwaAssetGenerator = require('pwa-asset-generator');
import pwaAssetGenerator from 'pwa-asset-generator';

/**
 * https://github.com/onderceylan/pwa-asset-generator
 * Generate images over a module function call, instead of using CLI commands
 */

const iconPath = './src/assets/icon.svg';
const pwaOutputPath = './src/assets/pwa';

(async () => {
  // favicon - other icons genrated too - in a transparent bg - overriden by next call
  await pwaAssetGenerator.generateImages(iconPath, pwaOutputPath, {
    iconOnly: true,
    favicon: true,
    index: './src/index.html',
    opaque: false,
    log: false,
  });

  // apple & android pwa icons
  await pwaAssetGenerator.generateImages(iconPath, pwaOutputPath, {
    iconOnly: true,
    scrape: true,
    padding: 'calc(50vh - 28%) calc(50vw - 28%)',
    manifest: './src/manifest.json',
    index: './src/index.html',
    opaque: true, // iOS adds black bg if transparent
    maskable: true,
    log: false,
  });

  // apple splash with darkmode
  const paddingSplash = 'calc(50vh - 10%) calc(50vw - 20%)';

  await pwaAssetGenerator.generateImages(iconPath, pwaOutputPath, {
    splashOnly: true,
    darkMode: false,
    scrape: true,
    padding: paddingSplash,
    index: './src/index.html',
    log: false,
  });

  await pwaAssetGenerator.generateImages(iconPath, pwaOutputPath, {
    splashOnly: true,
    darkMode: true,
    scrape: true,
    padding: paddingSplash,
    background: '#111',
    index: './src/index.html',
    log: false,
  });
})();

/**
 * Size
 * Larger logo: --padding "calc(50vh - 20%) calc(50vw - 40%)"
 * Smaller logo: --padding "calc(50vh - 5%) calc(50vw - 10%)"
 */

/**
 * Dark Mode
 * npx pwa-asset-generator light-logo.svg ./assets --dark-mode --background dimgrey --splash-only --type jpeg --quality 80 --index ./src/app/index.html
 * npx pwa-asset-generator dark-logo.svg ./assets --background lightgray --splash-only --type jpeg --quality 80 --index ./src/app/index.html
 */

// const { savedImages, htmlMeta, manifestJsonContent } =
// background: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',

// Access to static data for Apple Device specs that are used for generating launch images
// const appleDeviceSpecsForLaunchImages = pwaAssetGenerator.appleDeviceSpecsForLaunchImages;
