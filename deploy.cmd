@echo off

call ng build --prod

REM call npm run sw

call firebase functions:config:set stripe.testkey="sk_test_GV7eMzd97MnL8BQx9cbiODZv"

call firebase use default

call firebase deploy

echo "deployed"