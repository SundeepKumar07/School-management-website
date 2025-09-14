import getRole, { getUserId } from '@/lib/utils';
import React from 'react'
import HomePageContainer from './components/HomePageContainer';

const HomePage = async () => {
  const userId = await getUserId();
  const role = await getRole();
  return (
    <HomePageContainer role={role?.toString()} userId={userId?.toString()}/>
  )
}

export default HomePage;
