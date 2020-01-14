Remove-Item -Recurse 'C:\Users\Omistaja\Documents\ionic\NatureObservationsIo5\www\assets'
ionic build --source-map --prod
npx cap copy
