import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Progress } from '@/components/ui/progress';
import { Check, Printer, ChevronDown, ChevronUp, Sun, Cloud, Umbrella, Thermometer, Wind } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const PackingChecklist = ({ trip }) => {
  const tripId = trip?.id;
  const destination = trip?.userSelection?.location?.label || 'Unknown';
  const travelers = trip?.userSelection?.traveler || '1';
  const budget = trip?.userSelection?.budget || 'Medium';
  const days = trip?.userSelection?.noOfDays || 3;
  const storageKey = `packing-checklist-${tripId}`;

  // Generate packing items based on trip details
  const generatePackingItems = () => {
    // Essential items for all trips
    const essentials = [
      { id: 'passport', label: 'Passport/ID', category: 'essentials' },
      { id: 'wallet', label: 'Wallet with cash and cards', category: 'essentials' },
      { id: 'phone', label: 'Phone', category: 'essentials' },
      { id: 'charger', label: 'Phone charger', category: 'essentials' },
      { id: 'powerbank', label: 'Power bank', category: 'essentials' },
      { id: 'adapter', label: 'Travel adapter', category: 'essentials' },
      { id: 'medicine', label: 'Personal medications', category: 'essentials' },
      { id: 'insurance', label: 'Travel insurance documents', category: 'essentials' },
    ];

    // Clothing items based on trip duration
    const clothing = [
      { id: 'shirts', label: `T-shirts/tops (${Math.min(days, 7)} pcs)`, category: 'clothing' },
      { id: 'pants', label: `Pants/shorts (${Math.ceil(days / 2)} pcs)`, category: 'clothing' },
      { id: 'underwear', label: `Underwear (${days} pcs)`, category: 'clothing' },
      { id: 'socks', label: `Socks (${days} pcs)`, category: 'clothing' },
      { id: 'sleepwear', label: 'Sleepwear', category: 'clothing' },
      { id: 'jacket', label: 'Light jacket/sweater', category: 'clothing' },
    ];

    // Toiletries
    const toiletries = [
      { id: 'toothbrush', label: 'Toothbrush', category: 'toiletries' },
      { id: 'toothpaste', label: 'Toothpaste', category: 'toiletries' },
      { id: 'deodorant', label: 'Deodorant', category: 'toiletries' },
      { id: 'soap', label: 'Soap/shower gel', category: 'toiletries' },
      { id: 'shampoo', label: 'Shampoo/conditioner', category: 'toiletries' },
    ];

    // Additional items based on destination (simplified logic)
    const destination_lower = destination.toLowerCase();
    let destinationItems = [];

    // Beach/tropical destination items
    if (
      destination_lower.includes('beach') ||
      destination_lower.includes('island') ||
      destination_lower.includes('bali') ||
      destination_lower.includes('hawaii') ||
      destination_lower.includes('caribbean') ||
      destination_lower.includes('cancun') ||
      destination_lower.includes('maldives')
    ) {
      destinationItems = [
        { id: 'swimsuit', label: 'Swimsuit', category: 'destination' },
        { id: 'sunscreen', label: 'Sunscreen (high SPF)', category: 'destination' },
        { id: 'sunglasses', label: 'Sunglasses', category: 'destination' },
        { id: 'hat', label: 'Sun hat', category: 'destination' },
        { id: 'sandals', label: 'Sandals/flip-flops', category: 'destination' },
        { id: 'beach-towel', label: 'Beach towel', category: 'destination' },
      ];
    }
    // Mountain/hiking destination items
    else if (
      destination_lower.includes('mountain') ||
      destination_lower.includes('hiking') ||
      destination_lower.includes('alps') ||
      destination_lower.includes('trek') ||
      destination_lower.includes('trail')
    ) {
      destinationItems = [
        { id: 'hiking-boots', label: 'Hiking boots', category: 'destination' },
        { id: 'hiking-socks', label: 'Hiking socks', category: 'destination' },
        { id: 'backpack', label: 'Day backpack', category: 'destination' },
        { id: 'water-bottle', label: 'Water bottle', category: 'destination' },
        { id: 'first-aid', label: 'First aid kit', category: 'destination' },
        { id: 'rain-jacket', label: 'Rain jacket', category: 'destination' },
      ];
    }
    // City/urban destination items
    else if (
      destination_lower.includes('city') ||
      destination_lower.includes('new york') ||
      destination_lower.includes('paris') ||
      destination_lower.includes('london') ||
      destination_lower.includes('tokyo')
    ) {
      destinationItems = [
        { id: 'comfortable-shoes', label: 'Comfortable walking shoes', category: 'destination' },
        { id: 'city-map', label: 'City map or offline maps', category: 'destination' },
        { id: 'day-bag', label: 'Day bag/backpack', category: 'destination' },
        { id: 'camera', label: 'Camera', category: 'destination' },
        { id: 'umbrella', label: 'Travel umbrella', category: 'destination' },
      ];
    }
    // Default for all other destinations
    else {
      destinationItems = [
        { id: 'comfortable-shoes', label: 'Comfortable shoes', category: 'destination' },
        { id: 'day-bag', label: 'Day bag/backpack', category: 'destination' },
        { id: 'sunglasses', label: 'Sunglasses', category: 'destination' },
        { id: 'umbrella', label: 'Travel umbrella', category: 'destination' },
      ];
    }

    // Weather-specific items (simplified logic)
    let weatherItems = [];
    const isHotWeatherDestination = 
      destination_lower.includes('beach') || 
      destination_lower.includes('tropical') || 
      destination_lower.includes('desert');
    
    const isColdWeatherDestination = 
      destination_lower.includes('mountain') || 
      destination_lower.includes('alps') || 
      destination_lower.includes('winter');
    
    if (isHotWeatherDestination) {
      weatherItems = [
        { id: 'light-clothes', label: 'Lightweight, breathable clothing', category: 'weather' },
        { id: 'cooling-towel', label: 'Cooling towel', category: 'weather' },
        { id: 'aloe-vera', label: 'Aloe vera gel (for sunburns)', category: 'weather' },
        { id: 'insect-repellent', label: 'Insect repellent', category: 'weather' },
      ];
    } else if (isColdWeatherDestination) {
      weatherItems = [
        { id: 'warm-jacket', label: 'Warm jacket/coat', category: 'weather' },
        { id: 'thermal-layers', label: 'Thermal base layers', category: 'weather' },
        { id: 'gloves', label: 'Gloves', category: 'weather' },
        { id: 'scarf', label: 'Scarf', category: 'weather' },
        { id: 'beanie', label: 'Beanie/warm hat', category: 'weather' },
        { id: 'lip-balm', label: 'Lip balm', category: 'weather' },
      ];
    } else {
      weatherItems = [
        { id: 'weather-appropriate-clothes', label: 'Weather-appropriate clothes', category: 'weather' },
        { id: 'light-rain-jacket', label: 'Light rain jacket', category: 'weather' },
      ];
    }

    // Combine all items and ensure each has a unique ID
    return [
      ...essentials.map(item => ({ ...item, id: `essential-${item.id}` })),
      ...clothing.map(item => ({ ...item, id: `clothing-${item.id}` })),
      ...toiletries.map(item => ({ ...item, id: `toiletries-${item.id}` })),
      ...destinationItems.map(item => ({ ...item, id: `destination-${item.id}` })),
      ...weatherItems.map(item => ({ ...item, id: `weather-${item.id}` })),
    ];
  };

  // Load saved checklist items or generate new ones
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useLocalStorage(storageKey, generatePackingItems());
  const [progress, setProgress] = useState(0);

  // Update progress when items change
  useEffect(() => {
    const checkedCount = items.filter(item => item.checked).length;
    setProgress((checkedCount / items.length) * 100);
  }, [items]);

  // Toggle item checked state
  const toggleItem = (id) => {
    setItems(
      items.map(item => 
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  // Print the checklist
  const handlePrint = () => {
    const printContent = document.getElementById('packing-checklist');
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = `Print_${uniqueName}`;
    const printWindow = window.open(windowUrl, windowName, 'height=600,width=800');

    printWindow.document.write('<html><head><title>Packing Checklist</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { color: #333; text-align: center; }
      h2 { color: #666; margin-top: 20px; }
      .checklist-item { 
        display: flex; 
        align-items: center;
        margin: 8px 0;
        padding-bottom: 8px;
        border-bottom: 1px solid #eee;
      }
      .checkbox {
        display: inline-block;
        width: 16px;
        height: 16px;
        border: 1px solid #999;
        margin-right: 10px;
      }
      .checked { text-decoration: line-through; color: #999; }
      .progress-container {
        width: 100%;
        background-color: #f0f0f0;
        border-radius: 4px;
        margin: 20px 0;
      }
      .progress-bar {
        height: 10px;
        background-color: #4CAF50;
        border-radius: 4px;
        width: ${progress}%;
      }
      .header { display: flex; justify-content: space-between; align-items: center; }
      .destination { font-size: 18px; color: #666; margin-bottom: 20px; }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(`
      <div class="header">
        <h1>Packing Checklist for Your Trip</h1>
        <div>Progress: ${Math.round(progress)}%</div>
      </div>
      <div class="destination">Destination: ${destination} (${days} days)</div>
      <div class="progress-container"><div class="progress-bar"></div></div>
    `);

    // Group items by category
    const categories = {
      essentials: 'Essential Items',
      clothing: 'Clothing',
      toiletries: 'Toiletries',
      destination: 'Destination-Specific Items',
      weather: 'Weather-Appropriate Items'
    };

    Object.entries(categories).forEach(([category, title]) => {
      const categoryItems = items.filter(item => item.id.startsWith(category));
      if (categoryItems.length > 0) {
        printWindow.document.write(`<h2>${title}</h2>`);
        categoryItems.forEach(item => {
          printWindow.document.write(`
            <div class="checklist-item ${item.checked ? 'checked' : ''}">
              <div class="checkbox"></div>
              ${item.label}
            </div>
          `);
        });
      }
    });

    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    
    // Add a small delay to ensure content is fully loaded
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  // Get weather icon based on destination (simplified)
  const getWeatherIcon = () => {
    const destination_lower = destination.toLowerCase();
    
    if (
      destination_lower.includes('beach') || 
      destination_lower.includes('island') ||
      destination_lower.includes('tropical')
    ) {
      return <Sun className="h-5 w-5 text-yellow-500" />;
    } else if (
      destination_lower.includes('mountain') ||
      destination_lower.includes('alps')
    ) {
      return <Cloud className="h-5 w-5 text-blue-500" />;
    } else if (
      destination_lower.includes('rain') ||
      destination_lower.includes('seattle') ||
      destination_lower.includes('london')
    ) {
      return <Umbrella className="h-5 w-5 text-blue-400" />;
    } else {
      return <Thermometer className="h-5 w-5 text-orange-500" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-100 p-2 rounded-xl">
              <Check className="text-emerald-600 h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Packing Checklist</h2>
              <p className="text-sm text-gray-500">(Optional but cool!)</p>
            </div>
          </div>
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span className="sr-only">Toggle packing checklist</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        
        <CollapsibleContent className="mt-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getWeatherIcon()}
              <span className="text-sm font-medium">
                Smart recommendations for your {days}-day trip to {destination}
              </span>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
          </div>
          
          <div id="packing-checklist" className="space-y-6">
            {/* Progress indicator */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Your packing progress</span>
                <span className="text-sm font-medium">
                  {items.filter(item => item.checked).length} of {items.length} items
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            {/* Essentials */}
            <div>
              <h3 className="font-medium mb-2 text-gray-900">Essential Items</h3>
              <div className="space-y-1">
                {items
                  .filter(item => item.id.startsWith('essential'))
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center"
                    >
                      <div 
                        className={`flex h-5 w-5 items-center justify-center rounded border cursor-pointer mr-2 
                        ${item.checked 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-300'}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.checked && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <label 
                        className={`text-sm cursor-pointer ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Clothing */}
            <div>
              <h3 className="font-medium mb-2 text-gray-900">Clothing</h3>
              <div className="space-y-1">
                {items
                  .filter(item => item.id.startsWith('clothing'))
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center"
                    >
                      <div 
                        className={`flex h-5 w-5 items-center justify-center rounded border cursor-pointer mr-2 
                        ${item.checked 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-300'}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.checked && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <label 
                        className={`text-sm cursor-pointer ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Toiletries */}
            <div>
              <h3 className="font-medium mb-2 text-gray-900">Toiletries</h3>
              <div className="space-y-1">
                {items
                  .filter(item => item.id.startsWith('toiletries'))
                  .map(item => (
                    <div
                      key={item.id}
                      className="flex items-center"
                    >
                      <div 
                        className={`flex h-5 w-5 items-center justify-center rounded border cursor-pointer mr-2 
                        ${item.checked 
                          ? 'bg-emerald-500 border-emerald-500' 
                          : 'border-gray-300'}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.checked && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <label 
                        className={`text-sm cursor-pointer ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                        onClick={() => toggleItem(item.id)}
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
            
            {/* Destination-specific items */}
            {items.filter(item => item.id.startsWith('destination')).length > 0 && (
              <div>
                <h3 className="font-medium mb-2 text-gray-900">Destination-Specific Items</h3>
                <div className="space-y-1">
                  {items
                    .filter(item => item.id.startsWith('destination'))
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex items-center"
                      >
                        <div 
                          className={`flex h-5 w-5 items-center justify-center rounded border cursor-pointer mr-2 
                          ${item.checked 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-gray-300'}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <label 
                          className={`text-sm cursor-pointer ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
            
            {/* Weather-specific items */}
            {items.filter(item => item.id.startsWith('weather')).length > 0 && (
              <div>
                <h3 className="font-medium mb-2 text-gray-900">Weather-Appropriate Items</h3>
                <div className="space-y-1">
                  {items
                    .filter(item => item.id.startsWith('weather'))
                    .map(item => (
                      <div
                        key={item.id}
                        className="flex items-center"
                      >
                        <div 
                          className={`flex h-5 w-5 items-center justify-center rounded border cursor-pointer mr-2 
                          ${item.checked 
                            ? 'bg-emerald-500 border-emerald-500' 
                            : 'border-gray-300'}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.checked && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <label 
                          className={`text-sm cursor-pointer ${item.checked ? 'line-through text-gray-400' : 'text-gray-700'}`}
                          onClick={() => toggleItem(item.id)}
                        >
                          {item.label}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default PackingChecklist; 