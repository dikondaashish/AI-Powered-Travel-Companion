import React, { useEffect, useState } from 'react';
import { apiMonitor } from '../service/APIMonitoring';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from './ui/card';
import { Progress } from './ui/progress';

export default function APIUsageDashboard() {
  const [usage, setUsage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Get the initial stats
    setUsage(apiMonitor.getUsageStats());

    // Set up a refresh interval (every 1 minute)
    const intervalId = setInterval(() => {
      setUsage(apiMonitor.getUsageStats());
    }, 60000);

    return () => clearInterval(intervalId);
  }, [refreshKey]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (!usage) {
    return <div className="p-4">Loading API usage data...</div>;
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Google Places API Usage</span>
          <button 
            onClick={handleRefresh}
            className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 rounded"
          >
            Refresh
          </button>
        </CardTitle>
        <CardDescription>Monitoring API quota usage</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Place Details</span>
              <span className="text-sm text-gray-500">
                {usage.placeDetails.count} / {usage.placeDetails.limit} ({usage.placeDetails.percentage}%)
              </span>
            </div>
            <Progress value={usage.placeDetails.percentage} 
              className={usage.placeDetails.percentage > 80 ? "bg-red-200" : ""} />
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">Place Photos</span>
              <span className="text-sm text-gray-500">
                {usage.placePhotos.count} / {usage.placePhotos.limit} ({usage.placePhotos.percentage}%)
              </span>
            </div>
            <Progress value={usage.placePhotos.percentage} 
              className={usage.placePhotos.percentage > 80 ? "bg-red-200" : ""} />
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <div>
          <p>Total API calls: {usage.total}</p>
          <p>Last reset: {usage.lastReset}</p>
        </div>
      </CardFooter>
    </Card>
  );
} 