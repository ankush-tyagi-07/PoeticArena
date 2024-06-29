"use client";
import PoetryCard from '@/components/PoetryCard'
import { poetryData } from '@/constants'
import React from 'react'
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";


const Home = () => {
  // const tasks = useQuery(api.tasks.get);
  return (
    <div className='mt-9 flex flex-col gap-9'>
      <section className='flex flex-col gap-9'>
        <h1 className='text-20 font-bold text-white-1'>Trending Poetries</h1>
        {/* <div className="flex min-h-screen flex-col items-center justify-between p-24 text-white-1">
          {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
        </div> */}
        <div className='poetry_grid'>
          {poetryData.map(({ id, title, description, imgURL }) => (
            <PoetryCard
              key={id}
              imgURL={imgURL}
              title={title}
              description={description}
              poetryId={id}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home