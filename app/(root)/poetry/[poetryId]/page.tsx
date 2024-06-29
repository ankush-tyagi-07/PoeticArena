import React from 'react'

const PoetryDetails = ({params}: {params: { poetryId:String}}) => {
  return (
    <p className='text-white-1'>PoetryDetails for {params.poetryId}</p>
  )
}

export default PoetryDetails