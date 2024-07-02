'use client'

import { SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import Header from './Header';
import Carousel from './Carousel';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import LoaderSpinner from './LoaderSpinner';
import { useAudio } from '@/providers/AudioProvider';
import { cn } from '@/lib/utils';

const RightSidebar = () => {
  const { user } = useUser();
  const topPoets = useQuery(api.users.getTopUserByPoetryCount);
  const router = useRouter();

  const { audio } = useAudio();

  return (
    <section className={cn('right_sidebar h-[calc(100vh-5px)]', {
      'h-[calc(100vh-140px)]': audio?.audioUrl
    })}>
      <SignedIn>
        <Link href={`/profile/${user?.id}`} className="flex gap-3 pb-12">
          <UserButton />
          <div className="flex w-full items-center justify-between">
            <h1 className="text-16 truncate font-semibold text-white-1">{user?.firstName} {user?.lastName}</h1>
            <Image
              src="/icons/right-arrow.svg"
              alt="arrow"
              width={24}
              height={24}
            />
          </div>
        </Link>
      </SignedIn>
      <section>
         <Header headerTitle="Fans Like You" />
        <Carousel fansLikeDetail={topPoets!} />
      </section>
      <section className="flex flex-col gap-8 pt-12">
        <Header headerTitle="Top Poets" />
        <div className="flex flex-col gap-6">
          {topPoets?.slice(0, 3).map((poet) => (
            <div key={poet._id} className="flex cursor-pointer justify-between" onClick={() => router.push(`/profile/${poet.clerkId}`)}>
              <figure className="flex items-center gap-2">
                <Image
                  src={poet.imageURL}
                  alt={poet.name}
                  width={44}
                  height={44}
                  className="aspect-square rounded-lg"
                />
                <h2 className="text-14 font-semibold text-white-1">{poet.name}</h2>
              </figure>
              <div className="flex items-center">
                <p className="text-12 font-normal text-white-1">{poet.totalPoetries} poetries</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}

export default RightSidebar