import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ws from 'socket.io-client'

import './styles.css'
import { useKeyPress } from '../../hooks/useKeyPress'
import { ReactComponent as LeftArrow } from '../../assets/SlidesIcons/leftArrow.svg'
import { ReactComponent as RightArrow } from '../../assets/SlidesIcons/rightArrow.svg'
import { ReactComponent as Home } from '../../assets/SlidesIcons/home.svg'
import useAuth from '../../hooks/useAuth'

import config from '../../config'

const { wsBaseUrl } = config

interface ISliderProps {
  slides: string[]
  isLoading: boolean
}

const socket = ws(wsBaseUrl, {
  autoConnect: false
})

const Slider = ({ slides }: ISliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [comment, setComment] = useState('')
  const { owner } = useAuth()

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  useEffect(() => {
    socket.open()

    if (comment) {
      socket.emit('comments', comment)
    }

    if (owner) {
      socket.on('owner', data => {
        console.log('ger')
        console.log(data)
      })
    }

    return () => {
      socket.close()
    }
  }, [comment])

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      setComment(event.target.value)
    }
  }

  useKeyPress(goToNext, ['ArrowRight'])
  useKeyPress(goToPrevious, ['ArrowLeft'])
  console.log(owner)
  return (
    <>
      <div className="mb-20 text-center">
        <div
          dangerouslySetInnerHTML={{ __html: slides[currentIndex] }}
          className="html"
        ></div>
      </div>
      {/*------------------------ Control slides ------------------------ */}
      <div className="absolute inset-x-0 bottom-0 lg:pr-32 p-4 lg:py-5 lg:pl-32 flex-initial ">
        <div className="justify-self-end flex justify-between">
          <Link
            to="/presentations"
            className="hover:scale-125 focus: outline-none"
          >
            <Home strokeWidth={2} height={30} width={40} />
          </Link>
          {!owner && (
            <input
              id="comment"
              onKeyDown={handleKeyDown}
              className="w-full text-white py-2 px-2 mx-20 my-2 placeholder-grey border-b-2 border-grey-light focus:text-black outline-none"
              placeholder="Add a comment ..."
            />
          )}

          <div className="flex justify-around">
            <button
              className="mr-10 focus: outline-none hover:scale-125"
              onClick={goToPrevious}
            >
              <LeftArrow
                strokeWidth={2}
                height={40}
                width={40}
                className="hover:text-primary-default"
              />
            </button>
            <button
              className="focus: outline-none hover:scale-125"
              onClick={goToNext}
            >
              <RightArrow
                strokeWidth={2}
                height={40}
                width={40}
                className="hover:text-primary-default"
              />
            </button>
          </div>
        </div>
        <div className="w-full bg-grey-border h-1.5 mb-4 rounded-1">
          <div
            className="bg-blue-default h-1.5 rounded-1 progress"
            style={{
              width: `${
                currentIndex !== slides.length - 1
                  ? (currentIndex / slides.length) * 100
                  : 100
              }%`
            }}
          ></div>
        </div>
      </div>
    </>
  )
}

export default Slider
