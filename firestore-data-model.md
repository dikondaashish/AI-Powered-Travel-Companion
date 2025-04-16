# Firestore Data Model for Trip Stats Dashboard

## Current Data Model

The Trip Stats Dashboard uses the existing trip data from the `AITrips` collection. This approach minimizes database overhead and provides real-time updates without requiring additional storage or synchronization.

The dashboard analyzes the following fields from each trip document:

```
AITrips/
  {tripId}/
    id: string
    userEmail: string
    userSelection: {
      location: {
        label: string (city name)
        country: string
      }
      noOfDays: number
      budget: string (Budget|Moderate|Luxury)
      travelType: string (Solo|Family|Friends|Couple)
    }
    createdAt: timestamp
```

## Performance Considerations

For applications with a large number of trips, consider these optimizations:

### 1. Stats Aggregation Collection

Create a separate collection to store pre-computed statistics:

```
UserStats/
  {userEmail}/
    totalTrips: number
    countriesVisited: array of strings
    citiesExplored: array of strings
    totalDaysTraveled: number
    estimatedTotalSpend: number
    mostVisitedDestination: string
    favoriteType: string
    tripsByYear: {
      "2023": number,
      "2024": number
    }
    budgetDistribution: {
      "Budget": number,
      "Moderate": number,
      "Luxury": number
    }
    travelStyleBreakdown: {
      "Solo": number,
      "Family": number,
      "Friends": number,
      "Couple": number
    }
    lastUpdated: timestamp
```

This collection would be updated using Cloud Functions triggered on:
- Trip creation
- Trip modification
- Trip deletion

### 2. Achievement Collection

Track user achievements separately:

```
UserAchievements/
  {userEmail}/
    achievements: [
      {
        id: string
        name: string
        description: string
        earnedAt: timestamp
        iconName: string
      }
    ]
```

### 3. Query Optimizations

- Use composite indexes for frequently queried fields
- Limit query results with pagination
- Use subcollections for related data

### Implementation Notes

1. **Cloud Functions**: Create triggers that update aggregated statistics when trip data changes:

```javascript
exports.updateUserStats = functions.firestore
  .document('AITrips/{tripId}')
  .onWrite((change, context) => {
    // Get the user email from the trip document
    const userEmail = change.after.exists 
      ? change.after.data().userEmail 
      : change.before.data().userEmail;
      
    // Fetch all trips for this user
    return db.collection('AITrips')
      .where('userEmail', '==', userEmail)
      .get()
      .then(snapshot => {
        // Calculate stats from all trips
        const stats = calculateStatsFromTrips(snapshot.docs);
        
        // Update the UserStats document
        return db.collection('UserStats')
          .doc(userEmail)
          .set(stats, { merge: true });
      });
  });
```

2. **Security Rules**: Ensure proper access controls:

```
service cloud.firestore {
  match /databases/{database}/documents {
    // Basic rules for AITrips
    match /AITrips/{tripId} {
      allow read: if request.auth != null && request.auth.token.email == resource.data.userEmail;
      allow write: if request.auth != null && request.auth.token.email == request.resource.data.userEmail;
    }
    
    // Rules for UserStats
    match /UserStats/{userEmail} {
      allow read: if request.auth != null && request.auth.token.email == userEmail;
      // Only Cloud Functions can write to this collection
      allow write: if false;
    }
    
    // Rules for UserAchievements
    match /UserAchievements/{userEmail} {
      allow read: if request.auth != null && request.auth.token.email == userEmail;
      // Only Cloud Functions can write to this collection
      allow write: if false;
    }
  }
}
```

## Implementation Approach

For this application, we've chosen to calculate statistics on-the-fly in the client-side component. This approach works well for:

1. Applications with moderate data volume
2. Early-stage products focused on feature development
3. Solutions where real-time accuracy is more important than query performance

As your application scales to more users with larger trip histories, consider implementing the aggregation collections described above to improve dashboard loading performance. 