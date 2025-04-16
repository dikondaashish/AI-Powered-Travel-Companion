# AI-Powered Travel Guide

## Profile Pictures

The application currently stores profile pictures as base64 data directly in Firebase Firestore. This approach:

- Doesn't require Cloudinary configuration
- Works immediately without additional setup
- Is suitable for development and testing

### Important Notes:
- Base64 storage is not optimal for production environments as it increases the size of your Firestore documents
- For a production environment, consider implementing a proper cloud storage solution (Firebase Storage or Cloudinary)

### Future Cloudinary Implementation (Optional)

To implement Cloudinary storage for profile pictures in the future:

1. Create a Cloudinary account at https://cloudinary.com/
2. Set up your environment variables:
   ```
   CLOUDINARY_CLOUD_NAME=dsafzdodd
   CLOUDINARY_API_KEY=918334533949174
   CLOUDINARY_API_SECRET=k7Of3-OJXDyhQcAou1YH8D_Sh00
   ```
3. Create an upload preset:
   - Log in to your Cloudinary console
   - Navigate to Settings > Upload
   - Create an "Unsigned" upload preset named `travel_profile_pics`
   - Enable "Auto-Tagging" if desired
   - Set a max file size limit (5MB recommended)

4. Implement a server-side upload endpoint to securely handle Cloudinary uploads

## Environment Variables

The application requires the following environment variables:

```
VITE_GOOGLE_PLACE_API_KEY=your_google_maps_api_key
```

## Development

To start the development server:

```bash
npm run dev
```

## Build

To build the application for production:

```bash
npm run build
``` 