export const SelectTravelesList=[
    {
        id:1,
        title:'Just Me',
        desc:'A sole traveles in exploration',
        icon:'✈️',
        people:'1'
    },
    {
        id:2,
        title:'A Couple',
        desc:'Two traveles in tandem',
        icon:'🥂',
        people:'2 People'
    },
    {
        id:3,
        title:'Family',
        desc:'A group of fun loving adv',
        icon:'🏡',
        people:'3 to 5 People'
    },
    {
        id:4,
        title:'Friends',
        desc:'A bunch of thrill-seekes',
        icon:'⛵',
        people:'5 to 10 People'
    },
]


export const SelectBudgetOptions=[
    {
        id:1,
        title:'Budget Friendly',
        desc:'Stay conscious of costs',
        icon:'💵',
    },
    {
        id:2,
        title:'Moderate',
        desc:'Keep cost on the average side',
        icon:'💰',
    },
    {
        id:3,
        title:'Luxury',
        desc:'Dont worry about cost',
        icon:'💸',
    },
]

export const TravelPreferences = {
    locationTypes: [
        {
            id: 1,
            title: 'Urban',
            desc: 'City experiences and metropolitan areas',
            icon: '🏙️',
        },
        {
            id: 2,
            title: 'Beach',
            desc: 'Seaside and coastal destinations',
            icon: '🏖️',
        },
        {
            id: 3,
            title: 'Mountains',
            desc: 'Alpine and highland landscapes',
            icon: '⛰️',
        },
        {
            id: 4,
            title: 'Countryside',
            desc: 'Rural and pastoral settings',
            icon: '🌄',
        },
        {
            id: 5,
            title: 'Historical',
            desc: 'Places with significant heritage',
            icon: '🏛️',
        }
    ],
    learning: [
        {
            id: 1,
            title: 'Local Culture',
            desc: 'Learn about traditions and customs',
            icon: '🎭',
        },
        {
            id: 2,
            title: 'Cuisine',
            desc: 'Explore food and culinary arts',
            icon: '🍽️',
        },
        {
            id: 3,
            title: 'History',
            desc: 'Discover historical significance',
            icon: '📜',
        },
        {
            id: 4,
            title: 'Art & Museums',
            desc: 'Experience galleries and exhibitions',
            icon: '🖼️',
        }
    ],
    activities: [
        {
            id: 1,
            title: 'Hiking',
            desc: 'Trails and nature walks',
            icon: '🥾',
        },
        {
            id: 2,
            title: 'Water Sports',
            desc: 'Swimming, surfing, and diving',
            icon: '🏄‍♂️',
        },
        {
            id: 3,
            title: 'Adventure',
            desc: 'Exciting and thrilling experiences',
            icon: '🧗‍♀️',
        },
        {
            id: 4,
            title: 'Cycling',
            desc: 'Biking and scenic routes',
            icon: '🚴‍♀️',
        }
    ],
    relaxation: [
        {
            id: 1,
            title: 'Spa & Wellness',
            desc: 'Relaxation and rejuvenation',
            icon: '💆‍♀️',
        },
        {
            id: 2,
            title: 'Scenic Views',
            desc: 'Peaceful natural landscapes',
            icon: '🌅',
        },
        {
            id: 3,
            title: 'Resort Lounging',
            desc: 'Poolside and leisurely stays',
            icon: '🏨',
        },
        {
            id: 4,
            title: 'Gardens & Parks',
            desc: 'Tranquil green spaces',
            icon: '🌳',
        }
    ]
};

export const AI_PROMPT='Generate Travel Plan for Location : {location}, for {totalDays} Days for {traveler} with a {budget} budget, considering the following preferences: {preferences} give me Hotels options list with HotelName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, Place address, ticket Pricing, Time travel each of the location for {totalDays} days with each day plan with best time to visit in JSON format.'