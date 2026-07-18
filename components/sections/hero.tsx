'use client'
import React from 'react'
import { TextAnimate } from '../ui/text-animate'

const Hero = () => {
    return (
        <div className="mx-auto max-w-5xl border-x border-dashed border-neutral-400/50 p-4 flex flex-col text-left    ">
            <p className='font-hand text-sm text-neutral-100/40 p-4'>01</p>
            <div className='flex flex-col text-left pt-24 p-4' >
                <TextAnimate
                    by='character' animation="slideUp"
                    className='font-display text-3xl ml-2 -mb-8'
                >
                    Hi, I'm
                </TextAnimate>
                <TextAnimate className='font-display text-[10rem]  ' by='character' animation="slideUp"  >fluxorr.</TextAnimate>
            </div>

            <div></div>
        </div >
    )
}

export default Hero
