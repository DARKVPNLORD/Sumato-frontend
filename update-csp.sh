#!/bin/bash

# Script to update Content-Security-Policy in all HTML files
# to allow connections to the backend API and Firebase

# Define the new CSP
NEW_CSP="default-src 'self'; script-src 'self' https://www.gstatic.com https://apis.google.com; style-src 'self' https://fonts.googleapis.com https://cdnjs.cloudflare.com 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; img-src 'self' data: https://www.gstatic.com https://*.googleapis.com; connect-src 'self' https://sumato-technology-api.onrender.com https://*.googleapis.com https://*.firebase.com https://*.firebaseio.com https://identitytoolkit.googleapis.com; frame-src https://www.google.com https://*.firebaseapp.com;"

# Loop through all HTML files in the current directory
for file in *.html; do
  echo "Updating CSP in $file"
  # Use sed to replace the existing CSP with the new one
  sed -i '' "s|<meta http-equiv=\"Content-Security-Policy\" content=\".*\">|<meta http-equiv=\"Content-Security-Policy\" content=\"$NEW_CSP\">|g" "$file"
done

echo "CSP update completed!" 