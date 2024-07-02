'use client'

import EmptyState from '@/components/EmptyState';
import LoaderSpinner from '@/components/LoaderSpinner';
import PoetryCard from '@/components/PoetryCard';
import Searchbar from '@/components/Searchbar';
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Discover = ({ searchParams: { search} }: { searchParams : { search: string }}) => {
  const poetryData = useQuery(api.poetries.getPoetryBySearch,{search: search || ''});


  return (
    <div className='flex flex-col gap-9'>
      <Searchbar/>
      <div className='flex flex-col gap-9'>
        <h1 className='text-20 font-bold text-white-1'>
        {!search ? 'Discover Trending Poetries' : 'Search results for '}
        {search && <span className="text-white-2">{search}</span>}
        </h1>
        {poetryData ? (
          <>
            {poetryData.length > 0 ? (
              <div className='poetry_grid'>
              {poetryData?.map(({ _id, poetryTitle, poetryDescription, imageUrl }) => (
                  <PoetryCard 
                    key={_id}
                    imgUrl={imageUrl as string}
                    title={poetryTitle}
                    description={poetryDescription}
                    poetryId={_id} 
                  />
                ))}
              </div>
            ) : <EmptyState title='No Results found' />}
          </>
        ) : <LoaderSpinner />}
      </div>
    </div>
  )
}

export default Discover