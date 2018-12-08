@echo off

call ng build --prod

call npm run sw REM google sw-precache service worker generator

call npm run static-serve

echo "deployed"