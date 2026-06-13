import { useEffect, useMemo, useRef, useState } from "react"

function Surprise() {
  const [activeGift, setActiveGift] = useState(0)
  const [openGifts, setOpenGifts] = useState([false, false])
  const [openedGifts, setOpenedGifts] = useState([true, false])
  const [showCopiedPopup, setShowCopiedPopup] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const copiedTimeoutRef = useRef(null)
  const dragStartXRef = useRef(0)
  const draggingRef = useRef(false)
  const didDragRef = useRef(false)
  const fireflyRefs = useRef([])
  const animationFrameRef = useRef(null)
  const mousePositionRef = useRef({ x: -9999, y: -9999 })
  const viewportRef = useRef({ width: 0, height: 0 })

  const gifts = [
    {
      label: "This is for you Adoy <3",
      link: "https://discord.gift/w48BzWPwZw7kgnGB",
      className: "gift-box-blue",
    },
    {
      label: "Another surprise for you Adoy <3",
      link: "https://discord.gift/EEmJ9WTdf76tQEyQ",
      className: "gift-box-azure",
    },
  ]

  const yodaImages = [
    {
      src: "/grogu3.gif",
      className: "yoda-one",
    },
    {
      src: "/grogu2.gif",
      className: "yoda-two",
    },
    {
      src: "/grogu1.gif",
      className: "yoda-three",
    },
  ]

  const stars = useMemo(
    () =>
      Array.from({ length: 56 }, () => ({
        width: `${Math.random() * 2 + 1}px`,
        height: `${Math.random() * 2 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.8 + 0.2,
        animationDuration: `${Math.random() * 3 + 2}s`,
        animationDelay: `${Math.random() * 3}s`,
      })),
    []
  )

  const fireflies = useMemo(
    () =>
      Array.from({ length: 28 }, () => ({
        topValue: Math.random() * 85 + 8,
        leftValue: Math.random() * 90 + 5,
        animationDuration: `${Math.random() * 8 + 6}s`,
        animationDelay: `${Math.random() * 6}s`,
      })),
    []
  )

  const fallingStars = useMemo(
    () =>
      Array.from({ length: 18 }, () => ({
        top: `${Math.random() * 70}%`,
        left: `${Math.random() * 110}%`,
        animationDuration: `${Math.random() * 3 + 2.5}s`,
        animationDelay: `${Math.random() * 4}s`,
        opacity: Math.random() * 0.6 + 0.4,
      })),
    []
  )

  const dolphins = useMemo(
    () =>
      Array.from({ length: 7 }, () => ({
        top: `${Math.random() * 70 + 12}%`,
        left: `${Math.random() * 95}%`,
        size: `${Math.random() * 18 + 28}px`,
        animationDuration: `${Math.random() * 10 + 9}s`,
        animationDelay: `${Math.random() * 7}s`,
        rotate: `${Math.random() * 24 - 12}deg`,
      })),
    []
  )

  const updateFireflyMotion = () => {
    animationFrameRef.current = null

    const { x, y } = mousePositionRef.current
    const { width, height } = viewportRef.current

    if (x < -1000 || y < -1000 || width === 0 || height === 0) {
      fireflyRefs.current.forEach((element) => {
        if (element) {
          element.style.setProperty("--firefly-x", "0px")
          element.style.setProperty("--firefly-y", "0px")
        }
      })

      return
    }

    fireflies.forEach((firefly, index) => {
      const element = fireflyRefs.current[index]

      if (!element) {
        return
      }

      const fireflyX = (firefly.leftValue / 100) * width
      const fireflyY = (firefly.topValue / 100) * height
      const distanceX = fireflyX - x
      const distanceY = fireflyY - y
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
      const range = 140
      const strength = Math.max(0, (range - distance) / range)
      const angle = Math.atan2(distanceY, distanceX)
      const moveX = Math.cos(angle) * strength * 42
      const moveY = Math.sin(angle) * strength * 42

      element.style.setProperty("--firefly-x", `${moveX.toFixed(2)}px`)
      element.style.setProperty("--firefly-y", `${moveY.toFixed(2)}px`)
    })
  }

  const scheduleFireflyMotion = () => {
    if (animationFrameRef.current) {
      return
    }

    animationFrameRef.current = requestAnimationFrame(updateFireflyMotion)
  }

  useEffect(() => {
    const updateViewport = () => {
      viewportRef.current = {
        width: window.innerWidth || 0,
        height: window.innerHeight || 0,
      }
    }

    updateViewport()

    window.addEventListener("resize", updateViewport)

    return () => {
      window.removeEventListener("resize", updateViewport)

      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const openEnvelope = (index) => {
    if (index !== activeGift) {
      return
    }

    setOpenGifts((current) =>
      current.map((isOpen, giftIndex) => (giftIndex === index ? true : isOpen))
    )

    setOpenedGifts((current) =>
      current.map((isOpened, giftIndex) => (giftIndex === index ? true : isOpened))
    )
  }

  const closeEnvelope = () => {
    setOpenGifts((current) =>
      current.map((isOpen, giftIndex) =>
        giftIndex === activeGift && isOpen ? false : isOpen
      )
    )
  }

  const moveFireflies = (event) => {
    mousePositionRef.current = {
      x: event.clientX,
      y: event.clientY,
    }

    scheduleFireflyMotion()
  }

  const copyLink = async (event, link) => {
    event.stopPropagation()

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(link)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = link
        textArea.setAttribute("readonly", "")
        textArea.style.position = "fixed"
        textArea.style.top = "0"
        textArea.style.left = "-9999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        textArea.setSelectionRange(0, textArea.value.length)
        document.execCommand("copy")
        document.body.removeChild(textArea)
      }

      setShowCopiedPopup(true)

      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }

      copiedTimeoutRef.current = setTimeout(() => {
        setShowCopiedPopup(false)
      }, 1800)
    } catch {
      alert("Copy failed. Please copy the link manually.")
    }
  }

  const startDrag = (event) => {
    draggingRef.current = true
    didDragRef.current = false
    dragStartXRef.current = event.clientX
  }

  const moveDrag = (event) => {
    if (!draggingRef.current) {
      return
    }

    const nextOffset = event.clientX - dragStartXRef.current
    setDragOffset(nextOffset)

    if (Math.abs(nextOffset) > 8) {
      didDragRef.current = true
    }
  }

  const endDrag = () => {
    if (!draggingRef.current) {
      return
    }

    draggingRef.current = false

    if (dragOffset < -85 && activeGift < gifts.length - 1) {
      setActiveGift(activeGift + 1)
      setOpenGifts((current) => current.map(() => false))
    }

    if (dragOffset > 85 && activeGift > 0) {
      setActiveGift(activeGift - 1)
      setOpenGifts((current) => current.map(() => false))
    }

    setDragOffset(0)

    setTimeout(() => {
      didDragRef.current = false
    }, 0)
  }

  return (
    <div
      onClick={closeEnvelope}
      onMouseMove={(event) => {
        moveFireflies(event)
        moveDrag(event)
      }}
      onMouseLeave={() => {
        mousePositionRef.current = { x: -9999, y: -9999 }
        scheduleFireflyMotion()
        endDrag()
      }}
      onMouseUp={endDrag}
      onTouchMove={(event) => {
        if (event.touches[0]) {
          moveDrag({
            clientX: event.touches[0].clientX,
          })
        }
      }}
      onTouchEnd={endDrag}
      className={`relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10 transition-colors duration-700 ${
        activeGift === 0
          ? "bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900"
          : "bg-gradient-to-b from-[#050816] via-[#172554] to-[#020617]"
      }`}
    >
      {activeGift === 0 && (
        <>
          <div className="absolute inset-0 pointer-events-none background-layer">
            {stars.map((style, index) => (
              <span
                key={`star-${index}`}
                className="absolute rounded-full bg-white animate-pulse"
                style={style}
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none background-layer">
            {fireflies.map((firefly, index) => (
              <span
                key={`firefly-${index}`}
                ref={(element) => {
                  fireflyRefs.current[index] = element
                }}
                className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-yellow-300 shadow-[0_0_14px_5px_rgba(253,224,71,0.62)] animate-float firefly-dot"
                style={{
                  top: `${firefly.topValue}%`,
                  left: `${firefly.leftValue}%`,
                  animationDuration: firefly.animationDuration,
                  animationDelay: firefly.animationDelay,
                  "--firefly-x": "0px",
                  "--firefly-y": "0px",
                }}
              />
            ))}
          </div>
        </>
      )}

      {activeGift === 1 && (
        <>
          <div className="absolute inset-0 pointer-events-none background-layer">
            {fallingStars.map((star, index) => (
              <span
                key={`falling-star-${index}`}
                className="falling-star"
                style={star}
              />
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none background-layer">
            {dolphins.map((dolphin, index) => (
              <span
                key={`dolphin-${index}`}
                className="flying-dolphin"
                style={{
                  top: dolphin.top,
                  left: dolphin.left,
                  fontSize: dolphin.size,
                  animationDuration: dolphin.animationDuration,
                  animationDelay: dolphin.animationDelay,
                  "--dolphin-rotate": dolphin.rotate,
                }}
              >
                🐬
              </span>
            ))}
          </div>
        </>
      )}

      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 md:top-16 md:right-16 h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 shadow-[0_0_80px_30px_rgba(254,249,195,0.35)] animate-moon" />

      {showCopiedPopup && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-[0_12px_35px_rgba(15,23,42,0.35)]">
          Link copied!
        </div>
      )}

      <div
        onMouseDown={startDrag}
        onTouchStart={(event) => {
          if (event.touches[0]) {
            startDrag({
              clientX: event.touches[0].clientX,
            })
          }
        }}
        className="relative z-10 w-full max-w-[620px] overflow-visible"
      >
        <div
          className="gift-slider"
          style={{
            transform: `translateX(calc(${-activeGift * 100}% + ${dragOffset}px))`,
            transition: draggingRef.current ? "none" : "transform 0.65s ease-in-out",
          }}
        >
          {gifts.map((gift, index) => {
            const isOpen = openGifts[index]

            return (
              <div key={`gift-page-${index}`} className="gift-slide">
                <div
                  role="button"
                  tabIndex={activeGift === index ? 0 : -1}
                  aria-label={isOpen ? "Gift box is open" : "Open gift box"}
                  aria-disabled={activeGift !== index}
                  onClick={(event) => {
                    event.stopPropagation()

                    if (didDragRef.current || activeGift !== index) {
                      return
                    }

                    openEnvelope(index)
                  }}
                  onKeyDown={(event) => {
                    if (activeGift !== index) {
                      return
                    }

                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault()
                      openEnvelope(index)
                    }
                  }}
                  className={`relative envelope-wrap border-0 bg-transparent p-0 ${
                    activeGift === index ? "cursor-pointer" : "cursor-default pointer-events-none"
                  }`}
                >
                  <div className={`gift-box ${gift.className} ${isOpen ? "open" : ""}`}>
                    {index === 0 && openedGifts[index] && (
                      <div className="opened-already-label">Opened already</div>
                    )}

                    {index === 0 && isOpen && (
                      <div className="yoda-layer">
                        {yodaImages.map((yoda, yodaIndex) => (
                          <img
                            key={`yoda-${yodaIndex}`}
                            src={yoda.src}
                            alt=""
                            className={`yoda-image ${yoda.className}`}
                            draggable={false}
                          />
                        ))}
                      </div>
                    )}

                    <div className="letter">
                      <div className="surprise-content">
                        <p className="surprise-label">{gift.label}</p>

                        <div
                          className="revealed-link-text"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {gift.link}
                        </div>

                        <button
                          type="button"
                          onClick={(event) => copyLink(event, gift.link)}
                          onMouseDown={(event) => event.stopPropagation()}
                          onTouchStart={(event) => event.stopPropagation()}
                          className="copy-link-button"
                        >
                          Copy link
                        </button>
                      </div>
                    </div>

                    <div className="gift-shadow" />
                    <div className="gift-base" />
                    <div className="gift-ribbon-vertical" />
                    <div className="gift-ribbon-horizontal" />
                    <div className="gift-lid" />
                    <div className="gift-lid-ribbon" />
                    <div className="gift-bow gift-bow-left" />
                    <div className="gift-bow gift-bow-right" />
                    <div className="gift-bow-center" />

                    {index === 1 ? (
                      <div className="blue-rose-seal">
                        <span className="rose-petal rose-petal-1" />
                        <span className="rose-petal rose-petal-2" />
                        <span className="rose-petal rose-petal-3" />
                        <span className="rose-petal rose-petal-4" />
                        <span className="rose-petal rose-petal-5" />
                        <span className="rose-petal rose-petal-6" />
                        <span className="rose-center" />
                      </div>
                    ) : (
                      <div className="heart-seal" />
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="slide-guide" onClick={(event) => event.stopPropagation()}>
          <span className="slide-arrow">←</span>
          <span>Slide to see the gifts</span>
          <span className="slide-arrow">→</span>
        </div>

        <div className="gift-dots" onClick={(event) => event.stopPropagation()}>
          {gifts.map((_, index) => (
            <span
              key={`dot-${index}`}
              aria-label={`Gift ${index + 1}`}
              className={`gift-dot ${activeGift === index ? "active" : ""}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translate3d(var(--firefly-x, 0px), var(--firefly-y, 0px), 0) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate3d(calc(var(--firefly-x, 0px) + 35px), calc(var(--firefly-y, 0px) - 45px), 0) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate3d(calc(var(--firefly-x, 0px) - 25px), calc(var(--firefly-y, 0px) - 80px), 0) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translate3d(calc(var(--firefly-x, 0px) - 45px), calc(var(--firefly-y, 0px) + 25px), 0) scale(1.15);
            opacity: 1;
          }
          100% {
            transform: translate3d(var(--firefly-x, 0px), var(--firefly-y, 0px), 0) scale(1);
            opacity: 0.4;
          }
        }

        @keyframes moon {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -14px, 0) scale(1.04);
          }
        }

        @keyframes envelope-breathe {
          0%, 100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(0, -10px, 0) scale(1.03);
          }
        }

        @keyframes falling-star {
          0% {
            transform: translate3d(0, 0, 0) rotate(-38deg) scaleX(0.45);
            opacity: 0;
          }
          12% {
            opacity: var(--star-opacity, 1);
          }
          100% {
            transform: translate3d(-340px, 440px, 0) rotate(-38deg) scaleX(1);
            opacity: 0;
          }
        }

        @keyframes dolphin-fly {
          0% {
            transform: translate3d(-18vw, 0, 0) rotate(var(--dolphin-rotate)) scaleX(1);
            opacity: 0;
          }
          10% {
            opacity: 0.95;
          }
          45% {
            transform: translate3d(38vw, -52px, 0) rotate(calc(var(--dolphin-rotate) + 14deg)) scaleX(1);
          }
          70% {
            transform: translate3d(72vw, 34px, 0) rotate(calc(var(--dolphin-rotate) - 10deg)) scaleX(1);
          }
          100% {
            transform: translate3d(112vw, -30px, 0) rotate(var(--dolphin-rotate)) scaleX(1);
            opacity: 0;
          }
        }

        @keyframes slide-label-glow {
          0%, 100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.78;
          }
          50% {
            transform: translate3d(0, -4px, 0);
            opacity: 1;
          }
        }

        @keyframes slide-arrow-move {
          0%, 100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(4px, 0, 0);
          }
        }

        @keyframes yoda-pop {
          0% {
            opacity: 0;
            transform: translate3d(0, 22px, 0) scale(0.45) rotate(-8deg);
          }
          70% {
            opacity: 1;
            transform: translate3d(0, -8px, 0) scale(1.08) rotate(4deg);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1) rotate(0deg);
          }
        }

        @keyframes yoda-bob {
          0%, 100% {
            margin-top: 0;
          }
          50% {
            margin-top: -8px;
          }
        }

        .background-layer {
          contain: layout paint style;
          transform: translateZ(0);
        }

        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .firefly-dot {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .animate-moon {
          animation-name: moon;
          animation-duration: 6s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          will-change: transform;
          transform: translateZ(0);
        }

        .falling-star {
          position: absolute;
          width: 120px;
          height: 2px;
          border-radius: 999px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.95), rgba(191, 219, 254, 0.2));
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.45);
          animation-name: falling-star;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
          opacity: 0;
          --star-opacity: 1;
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .falling-star::before {
          content: "";
          position: absolute;
          right: 0;
          top: 50%;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: white;
          transform: translateY(-50%);
          box-shadow: 0 0 14px 4px rgba(191, 219, 254, 0.58);
        }

        .flying-dolphin {
          position: absolute;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          filter: drop-shadow(0 6px 10px rgba(2, 6, 23, 0.26));
          animation-name: dolphin-fly;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
          opacity: 0;
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .gift-slider {
          display: flex;
          width: 100%;
          overflow: visible;
          will-change: transform;
          transform: translateZ(0);
        }

        .gift-slide {
          min-width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          padding: 70px 0 34px;
        }

        .slide-guide {
          position: relative;
          z-index: 25;
          margin: -10px auto 0;
          width: fit-content;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.24);
          background: rgba(255, 255, 255, 0.12);
          padding: 10px 18px;
          color: white;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: 0.02em;
          box-shadow: 0 12px 32px rgba(15, 23, 42, 0.25);
          backdrop-filter: blur(10px);
          animation: slide-label-glow 2.2s ease-in-out infinite;
          user-select: none;
          pointer-events: auto;
          will-change: transform, opacity;
        }

        .slide-arrow {
          display: inline-flex;
          animation: slide-arrow-move 1.2s ease-in-out infinite;
          will-change: transform;
        }

        .slide-arrow:first-child {
          animation-direction: reverse;
        }

        .gift-dots {
          position: relative;
          z-index: 25;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 14px;
          pointer-events: none;
        }

        .gift-dot {
          width: 10px;
          height: 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.45);
          transition:
            width 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .gift-dot.active {
          width: 34px;
          background: white;
          box-shadow: 0 0 18px rgba(255, 255, 255, 0.45);
        }

        .envelope-wrap {
          width: 510px;
          height: 390px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: envelope-breathe 5s ease-in-out infinite;
          overflow: visible;
          will-change: transform;
          transform: translateZ(0);
        }

        .gift-box {
          position: relative;
          width: 470px;
          height: 330px;
          filter: drop-shadow(0 30px 38px rgba(15, 23, 42, 0.5));
          perspective: 1000px;
          overflow: visible;
        }

        .opened-already-label {
          position: absolute;
          left: 50%;
          top: -44px;
          z-index: 30;
          transform: translateX(-50%);
          border-radius: 999px;
          border: 1px solid rgba(191, 219, 254, 0.75);
          background: linear-gradient(135deg, rgba(239, 246, 255, 0.96), rgba(191, 219, 254, 0.92));
          padding: 8px 18px;
          color: #1d4ed8;
          font-size: 14px;
          font-weight: 900;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          white-space: nowrap;
          box-shadow:
            0 12px 28px rgba(15, 23, 42, 0.24),
            0 0 22px rgba(147, 197, 253, 0.55);
          pointer-events: none;
        }

        .yoda-layer {
          position: absolute;
          inset: 0;
          z-index: 24;
          pointer-events: none;
        }

        .yoda-image {
          position: absolute;
          width: 82px;
          height: 82px;
          object-fit: contain;
          user-select: none;
          filter: drop-shadow(0 12px 18px rgba(15, 23, 42, 0.35));
          animation:
            yoda-pop 0.55s ease-out both,
            yoda-bob 2.8s ease-in-out infinite;
        }

        .yoda-one {
          left: 16px;
          top: 104px;
          animation-delay: 0.12s, 0.7s;
        }

        .yoda-two {
          right: 20px;
          top: 92px;
          animation-delay: 0.24s, 1s;
        }

        .yoda-three {
          left: 50%;
          bottom: 4px;
          transform: translateX(-50%);
          animation-delay: 0.36s, 1.3s;
        }

        .gift-shadow {
          position: absolute;
          left: 45px;
          right: 45px;
          bottom: 6px;
          height: 34px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.4);
          filter: blur(18px);
          z-index: 0;
        }

        .gift-base {
          position: absolute;
          left: 42px;
          right: 42px;
          bottom: 18px;
          height: 230px;
          border-radius: 26px;
          background: linear-gradient(145deg, #60a5fa, #2563eb 55%, #1d4ed8);
          box-shadow:
            inset 0 0 28px rgba(255, 255, 255, 0.22),
            inset 0 -26px 38px rgba(30, 64, 175, 0.35),
            0 0 55px rgba(59, 130, 246, 0.4);
          overflow: hidden;
          z-index: 2;
        }

        .gift-base::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(255, 255, 255, 0.28), transparent 26%),
            radial-gradient(circle at 82% 28%, rgba(191, 219, 254, 0.22), transparent 24%),
            linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.12), transparent);
          opacity: 0.85;
        }

        .gift-ribbon-vertical {
          position: absolute;
          left: 50%;
          bottom: 18px;
          width: 82px;
          height: 230px;
          transform: translateX(-50%);
          background: linear-gradient(180deg, #bfdbfe, #60a5fa 45%, #1e40af);
          box-shadow:
            inset 10px 0 14px rgba(255, 255, 255, 0.25),
            inset -10px 0 14px rgba(30, 64, 175, 0.25);
          z-index: 4;
        }

        .gift-ribbon-horizontal {
          position: absolute;
          left: 42px;
          right: 42px;
          bottom: 122px;
          height: 70px;
          background: linear-gradient(90deg, #bfdbfe, #60a5fa 45%, #1e40af);
          box-shadow:
            inset 0 10px 14px rgba(255, 255, 255, 0.24),
            inset 0 -10px 14px rgba(30, 64, 175, 0.28);
          z-index: 5;
        }

        .gift-lid {
          position: absolute;
          left: 18px;
          right: 18px;
          top: 64px;
          height: 92px;
          border-radius: 24px;
          background: linear-gradient(145deg, #93c5fd, #3b82f6 55%, #2563eb);
          box-shadow:
            inset 0 0 24px rgba(255, 255, 255, 0.25),
            0 18px 24px rgba(15, 23, 42, 0.25),
            0 0 40px rgba(59, 130, 246, 0.35);
          transform-origin: left center;
          transition:
            transform 0.75s ease-in-out,
            top 0.75s ease-in-out;
          z-index: 8;
          will-change: transform, top;
        }

        .gift-box.open .gift-lid {
          top: 16px;
          transform: rotate(-8deg) translate(-18px, -46px);
        }

        .gift-lid-ribbon {
          position: absolute;
          left: 50%;
          top: 64px;
          width: 90px;
          height: 92px;
          transform: translateX(-50%);
          border-radius: 14px;
          background: linear-gradient(180deg, #dbeafe, #60a5fa 50%, #1e40af);
          box-shadow:
            inset 10px 0 14px rgba(255, 255, 255, 0.3),
            inset -10px 0 14px rgba(30, 64, 175, 0.25);
          transition:
            transform 0.75s ease-in-out,
            top 0.75s ease-in-out;
          z-index: 9;
          will-change: transform, top;
        }

        .gift-box.open .gift-lid-ribbon {
          top: 16px;
          transform: translateX(-50%) rotate(-8deg) translate(-18px, -46px);
        }

        .gift-bow {
          position: absolute;
          top: 0;
          width: 118px;
          height: 82px;
          border: 18px solid #60a5fa;
          background: rgba(147, 197, 253, 0.35);
          box-shadow:
            inset 0 0 18px rgba(255, 255, 255, 0.28),
            0 10px 22px rgba(15, 23, 42, 0.22);
          transition:
            transform 0.75s ease-in-out,
            top 0.75s ease-in-out;
          z-index: 10;
          will-change: transform, top;
        }

        .gift-bow-left {
          left: 132px;
          border-radius: 70% 35% 70% 35%;
          transform: rotate(-18deg);
        }

        .gift-bow-right {
          right: 132px;
          border-radius: 35% 70% 35% 70%;
          transform: rotate(18deg);
        }

        .gift-box.open .gift-bow-left {
          top: -46px;
          transform: rotate(-18deg) translate(-18px, -28px);
        }

        .gift-box.open .gift-bow-right {
          top: -46px;
          transform: rotate(18deg) translate(-18px, -28px);
        }

        .gift-bow-center {
          position: absolute;
          left: 50%;
          top: 36px;
          width: 58px;
          height: 48px;
          border-radius: 18px;
          background: linear-gradient(135deg, #dbeafe, #60a5fa, #2563eb);
          transform: translateX(-50%);
          box-shadow:
            inset 0 0 14px rgba(255, 255, 255, 0.3),
            0 10px 20px rgba(15, 23, 42, 0.25);
          transition:
            transform 0.75s ease-in-out,
            top 0.75s ease-in-out;
          z-index: 11;
          will-change: transform, top;
        }

        .gift-box.open .gift-bow-center {
          top: -10px;
          transform: translateX(-50%) rotate(-8deg) translate(-18px, -44px);
        }

        .letter {
          position: absolute;
          left: 62px;
          right: 62px;
          top: 44px;
          height: 230px;
          border-radius: 22px;
          background: linear-gradient(180deg, #f8fbff, #dbeafe);
          box-shadow: 0 14px 30px rgba(15, 23, 42, 0.2);
          z-index: 3;
          transform: translateY(84px) scale(0.96);
          opacity: 0;
          transition:
            transform 0.75s ease-in-out,
            opacity 0.45s ease-in-out;
          will-change: transform, opacity;
        }

        .gift-box.open .letter {
          transform: translateY(2px) scale(1);
          opacity: 1;
          z-index: 7;
          transition-delay: 0.22s;
        }

        .surprise-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 28px;
          text-align: center;
        }

        .surprise-label {
          margin: 0;
          color: #1e3a8a;
          font-size: 22px;
          font-weight: 800;
        }

        .revealed-link-text {
          max-width: 100%;
          padding: 10px 16px;
          border-radius: 16px;
          background: rgba(37, 99, 235, 0.1);
          color: #1d4ed8;
          font-size: 16px;
          font-weight: 700;
          overflow-wrap: anywhere;
          user-select: text;
          cursor: text;
        }

        .copy-link-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 20px;
          border: 0;
          border-radius: 999px;
          background: linear-gradient(135deg, #2563eb, #60a5fa);
          color: white;
          font-size: 15px;
          font-weight: 700;
          font-family: inherit;
          box-shadow: 0 10px 22px rgba(37, 99, 235, 0.3);
          cursor: pointer;
        }

        .copy-link-button:active {
          transform: scale(0.96);
        }

        .heart-seal {
          position: absolute;
          left: 50%;
          top: 58%;
          width: 60px;
          height: 60px;
          background: #1d4ed8;
          transform: translate(-50%, -50%) rotate(-45deg) scale(1);
          z-index: 12;
          opacity: 1;
          box-shadow: 0 0 22px rgba(147, 197, 253, 0.7);
          transition:
            opacity 0.35s ease-in-out,
            transform 0.45s ease-in-out;
        }

        .gift-box.open .heart-seal {
          opacity: 0;
          transform: translate(-50%, -50%) rotate(-45deg) scale(0.75);
        }

        .heart-seal::before,
        .heart-seal::after {
          content: "";
          position: absolute;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #1d4ed8;
        }

        .heart-seal::before {
          top: -30px;
          left: 0;
        }

        .heart-seal::after {
          left: 30px;
          top: 0;
        }

        .blue-rose-seal {
          position: absolute;
          left: 50%;
          top: 58%;
          width: 78px;
          height: 78px;
          transform: translate(-50%, -50%) scale(1);
          z-index: 12;
          opacity: 1;
          filter: drop-shadow(0 0 18px rgba(125, 211, 252, 0.85));
          transition:
            opacity 0.35s ease-in-out,
            transform 0.45s ease-in-out;
        }

        .gift-box.open .blue-rose-seal {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.75);
        }

        .rose-petal,
        .rose-center {
          position: absolute;
          left: 50%;
          top: 50%;
          display: block;
          transform-origin: center;
        }

        .rose-petal {
          width: 38px;
          height: 52px;
          border-radius: 70% 30% 70% 35%;
          background: linear-gradient(145deg, #dbeafe, #38bdf8 42%, #075985);
          box-shadow:
            inset 0 0 10px rgba(255, 255, 255, 0.45),
            inset 0 -12px 18px rgba(7, 89, 133, 0.35),
            0 0 14px rgba(56, 189, 248, 0.45);
        }

        .rose-petal-1 {
          transform: translate(-50%, -78%) rotate(0deg);
        }

        .rose-petal-2 {
          transform: translate(-23%, -58%) rotate(58deg);
        }

        .rose-petal-3 {
          transform: translate(-30%, -24%) rotate(118deg);
        }

        .rose-petal-4 {
          transform: translate(-72%, -24%) rotate(180deg);
        }

        .rose-petal-5 {
          transform: translate(-82%, -58%) rotate(238deg);
        }

        .rose-petal-6 {
          transform: translate(-50%, -52%) rotate(298deg);
        }

        .rose-center {
          width: 34px;
          height: 34px;
          border-radius: 50% 45% 50% 45%;
          background:
            radial-gradient(circle at 35% 32%, #eff6ff 0 12%, transparent 13%),
            conic-gradient(from 30deg, #0c4a6e, #38bdf8, #bfdbfe, #0284c7, #075985, #0c4a6e);
          transform: translate(-50%, -50%) rotate(22deg);
          box-shadow:
            inset 0 0 9px rgba(255, 255, 255, 0.55),
            0 0 14px rgba(125, 211, 252, 0.75);
        }

        .gift-box-azure .gift-base {
          background: linear-gradient(145deg, #7dd3fc, #0284c7 52%, #075985);
          box-shadow:
            inset 0 0 28px rgba(255, 255, 255, 0.25),
            inset 0 -26px 38px rgba(7, 89, 133, 0.38),
            0 0 58px rgba(56, 189, 248, 0.42);
        }

        .gift-box-azure .gift-ribbon-vertical,
        .gift-box-azure .gift-ribbon-horizontal,
        .gift-box-azure .gift-lid-ribbon {
          background: linear-gradient(180deg, #e0f2fe, #38bdf8 48%, #075985);
        }

        .gift-box-azure .gift-ribbon-horizontal {
          background: linear-gradient(90deg, #e0f2fe, #38bdf8 45%, #075985);
        }

        .gift-box-azure .gift-lid {
          background: linear-gradient(145deg, #bae6fd, #0ea5e9 55%, #0369a1);
          box-shadow:
            inset 0 0 24px rgba(255, 255, 255, 0.28),
            0 18px 24px rgba(15, 23, 42, 0.25),
            0 0 42px rgba(56, 189, 248, 0.42);
        }

        .gift-box-azure .gift-bow {
          border-color: #38bdf8;
          background: rgba(186, 230, 253, 0.38);
        }

        .gift-box-azure .gift-bow-center,
        .gift-box-azure .copy-link-button {
          background: linear-gradient(135deg, #e0f2fe, #38bdf8, #0369a1);
        }

        .gift-box-azure .surprise-label {
          color: #075985;
        }

        .gift-box-azure .revealed-link-text {
          background: rgba(14, 165, 233, 0.12);
          color: #0369a1;
        }

        @media (max-width: 640px) {
          @keyframes float {
            0% {
              transform: translate3d(var(--firefly-x, 0px), var(--firefly-y, 0px), 0) scale(1);
              opacity: 0.4;
            }
            25% {
              transform: translate3d(calc(var(--firefly-x, 0px) + 18px), calc(var(--firefly-y, 0px) - 25px), 0) scale(1.15);
              opacity: 1;
            }
            50% {
              transform: translate3d(calc(var(--firefly-x, 0px) - 15px), calc(var(--firefly-y, 0px) - 45px), 0) scale(0.9);
              opacity: 0.7;
            }
            75% {
              transform: translate3d(calc(var(--firefly-x, 0px) - 22px), calc(var(--firefly-y, 0px) + 18px), 0) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translate3d(var(--firefly-x, 0px), var(--firefly-y, 0px), 0) scale(1);
              opacity: 0.4;
            }
          }

          @keyframes moon {
            0%, 100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -8px, 0) scale(1.03);
            }
          }

          @keyframes falling-star {
            0% {
              transform: translate3d(0, 0, 0) rotate(-38deg) scaleX(0.45);
              opacity: 0;
            }
            12% {
              opacity: var(--star-opacity, 1);
            }
            100% {
              transform: translate3d(-190px, 270px, 0) rotate(-38deg) scaleX(1);
              opacity: 0;
            }
          }

          .gift-slide {
            padding: 52px 0 28px;
          }

          .slide-guide {
            margin-top: -4px;
            padding: 9px 14px;
            font-size: 12px;
            gap: 8px;
          }

          .gift-dots {
            margin-top: 12px;
          }

          .falling-star {
            width: 82px;
          }

          .envelope-wrap {
            width: 340px;
            height: 285px;
          }

          .gift-box {
            width: 325px;
            height: 242px;
          }

          .opened-already-label {
            top: -36px;
            padding: 7px 14px;
            font-size: 11px;
          }

          .yoda-image {
            width: 52px;
            height: 52px;
          }

          .yoda-one {
            left: 8px;
            top: 78px;
          }

          .yoda-two {
            right: 10px;
            top: 74px;
          }

          .yoda-three {
            bottom: 0;
          }

          .gift-shadow {
            left: 30px;
            right: 30px;
            bottom: 4px;
            height: 24px;
          }

          .gift-base {
            left: 28px;
            right: 28px;
            bottom: 14px;
            height: 158px;
            border-radius: 20px;
          }

          .gift-ribbon-vertical {
            bottom: 14px;
            width: 56px;
            height: 158px;
          }

          .gift-ribbon-horizontal {
            left: 28px;
            right: 28px;
            bottom: 84px;
            height: 48px;
          }

          .gift-lid {
            left: 14px;
            right: 14px;
            top: 52px;
            height: 64px;
            border-radius: 18px;
          }

          .gift-box.open .gift-lid {
            top: 28px;
            transform: rotate(-8deg) translate(-12px, -34px);
          }

          .gift-lid-ribbon {
            top: 52px;
            width: 60px;
            height: 64px;
            border-radius: 12px;
          }

          .gift-box.open .gift-lid-ribbon {
            top: 28px;
            transform: translateX(-50%) rotate(-8deg) translate(-12px, -34px);
          }

          .gift-bow {
            top: 10px;
            width: 76px;
            height: 54px;
            border-width: 12px;
          }

          .gift-bow-left {
            left: 88px;
          }

          .gift-bow-right {
            right: 88px;
          }

          .gift-box.open .gift-bow-left {
            top: -12px;
            transform: rotate(-18deg) translate(-12px, -26px);
          }

          .gift-box.open .gift-bow-right {
            top: -12px;
            transform: rotate(18deg) translate(-12px, -26px);
          }

          .gift-bow-center {
            top: 34px;
            width: 40px;
            height: 34px;
            border-radius: 13px;
          }

          .gift-box.open .gift-bow-center {
            top: 10px;
            transform: translateX(-50%) rotate(-8deg) translate(-12px, -32px);
          }

          .letter {
            left: 43px;
            right: 43px;
            top: 40px;
            height: 158px;
          }

          .gift-box.open .letter {
            transform: translateY(2px) scale(1);
            z-index: 7;
          }

          .surprise-content {
            gap: 8px;
            padding: 18px;
          }

          .surprise-label {
            font-size: 16px;
          }

          .revealed-link-text {
            padding: 8px 12px;
            font-size: 12px;
            border-radius: 12px;
          }

          .copy-link-button {
            padding: 8px 14px;
            font-size: 12px;
          }

          .heart-seal {
            width: 40px;
            height: 40px;
            top: 60%;
          }

          .heart-seal::before,
          .heart-seal::after {
            width: 40px;
            height: 40px;
          }

          .heart-seal::before {
            top: -20px;
          }

          .heart-seal::after {
            left: 20px;
          }

          .blue-rose-seal {
            width: 52px;
            height: 52px;
            top: 60%;
          }

          .rose-petal {
            width: 26px;
            height: 35px;
          }

          .rose-center {
            width: 23px;
            height: 23px;
          }
        }
      `}</style>
    </div>
  )
}

export default Surprise