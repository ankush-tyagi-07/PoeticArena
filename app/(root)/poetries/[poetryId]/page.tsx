'use client'

import EmptyState from '@/components/EmptyState'
import LoaderSpinner from '@/components/LoaderSpinner'
import PoetryCard from '@/components/PoetryCard'
import PoetryDetailPlayer from '@/components/PoetryDetailPlayer'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import Image from 'next/image'
import React from 'react'

const PoetryDetails = ({ params: { poetryId } }: { params: { poetryId: Id<'poetries'> } }) => {

  const { user } = useUser();

  const poetry = useQuery(api.poetries.getPoetryById,{poetryId});

  const isOwner = user?.id === poetry?.authorId;

  const authorID = poetry?.authorId !== undefined ? poetry.authorId : "undefined";

  let similarPoetries = useQuery(api.poetries.getPoetriesByAuthorId, { authorId:authorID })?.poetries;

  if(!poetry || !similarPoetries){
    return <LoaderSpinner/>
  }

  if (similarPoetries) {
    similarPoetries = similarPoetries.filter((poetry) => poetry._id !== poetryId);
  }

  const formatVoicePrompt = (text:string) => {
    if (!text) return '';

    // Escape HTML entities
    let formattedText = text.replace(/&/g, '&amp;');
    formattedText = formattedText.replace(/</g, '&lt;');
    formattedText = formattedText.replace(/>/g, '&gt;');
    formattedText = formattedText.replace(/'/g, '&apos;');
    formattedText = formattedText.replace(/"/g, '&quot;');

    // Split the text by commas and periods
    formattedText = formattedText.replace(/,/g, ',<br>');
    formattedText = formattedText.replace(/\./g, '.<br><br>');

    return formattedText;
  };

  return (
    <section className='flex w-full flex-col'>
      <header className='mt-9 flex items-center justify-between'>
        <h1 className='text-20 font-bold text-white-1'>
          Currently Playing
        </h1>
        <figure className='flex gap-3'>
          <Image
            src='/icons/headphone.svg'
            alt='headphone'
            width={24}
            height={24}
          />
          {/* <h2 className='text-16 font-bold text-white-1'>
            {poetry?.views}
          </h2> */}
        </figure>
      </header>

      <PoetryDetailPlayer 
        isOwner={isOwner}
        poetryId={poetry._id}
        {...poetry}
      />
      
      <p className="text-white-2 text-16 pb-8 pt-[45px] font-medium max-md:text-center">{poetry?.poetryDescription}</p>

      <div className='flex flex-col gap-8'>
        <div className='flex flex-col gap-4'>
          <h1 className='text-18 font-bold text-white-1'>Transcription</h1>
          <p className='text-16 font-medium text-white-2' dangerouslySetInnerHTML={{ __html: formatVoicePrompt(poetry?.voicePrompt ?? '') }}></p>
        </div>
      </div>

      <section className='mt-8 flex flex-col gap-5'>
        <h1 className='text-20 font-bold text-white-1'>
          Similar Poetries
        </h1>
        {similarPoetries && similarPoetries.length > 0 ? (
          <div className="poetry_grid">
            {similarPoetries?.map(({ _id, poetryTitle, poetryDescription, imageUrl }) => (
              <PoetryCard 
                key={_id}
                imgUrl={imageUrl as string}
                title={poetryTitle}
                description={poetryDescription}
                poetryId={_id}
              />
            ))}
          </div>
        ) : (
          <> 
            <EmptyState 
              title="No similar poetries found"
              buttonLink="/discover"
              buttonText="Discover more poetries"
            />
          </>
        )}
      </section>

    </section>
  )
}

export default PoetryDetails