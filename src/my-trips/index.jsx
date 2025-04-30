import { db } from '@/service/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useNavigation } from 'react-router-dom';
import UserTripCardItem from './components/UserTripCardItem';
import { useSEO } from '@/context/SEOContext';

function MyTrips() {
  const { pageSEO } = useSEO();
  const navigation=useNavigation();
  const [userTrips,setUserTrips]=useState([]);
  useEffect(()=>{
    GetUserTrips();
  },[])

  /**
   * Used to Get All User Trips
   * @returns 
   */
  const GetUserTrips=async()=>{
    const user=JSON.parse(localStorage.getItem('user'));
    console.log(user)
    if(!user)
    {
        navigation('/');
        return ;
    }
    
    const q=query(collection(db,'AITrips'),where('userEmail','==',user?.email));
    const querySnapshot = await getDocs(q);
    setUserTrips([]);
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        setUserTrips(prevVal=>[...prevVal,doc.data()])
      });
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-20 sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5'>
      {pageSEO.myTrips()}
      <h2 className='font-bold text-3xl'>My Trips</h2>

      <div className='grid grid-cols-2 mt-10 md:grid-cols-3 gap-5'>
        {userTrips?.length>0?userTrips.map((trip,index)=>(
          <UserTripCardItem trip={trip} key={index} />
        ))
      :[1,2,3,4,5,6].map((item,index)=>(
        <div key={index} className='h-[220px] w-full bg-slate-200 animate-pulse rounded-xl'>

        </div>
      ))
      }
      </div>
    </div> 
  )
}

export default MyTrips