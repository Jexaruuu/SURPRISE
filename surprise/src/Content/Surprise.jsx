import { useEffect, useMemo, useRef, useState } from "react"

function Surprise() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCopiedPopup, setShowCopiedPopup] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: -9999, y: -9999 })
  const copiedTimeoutRef = useRef(null)

  const link = "https://discord.gift/w48BzWPwZw7kgnGB"

  const stars = useMemo(
    () =>
      Array.from({ length: 80 }, () => ({
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
      Array.from({ length: 46 }, () => ({
        topValue: Math.random() * 85 + 8,
        leftValue: Math.random() * 90 + 5,
        animationDuration: `${Math.random() * 8 + 6}s`,
        animationDelay: `${Math.random() * 6}s`,
      })),
    []
  )

  useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current)
      }
    }
  }, [])

  const openEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true)
    }
  }

  const closeEnvelope = () => {
    if (isOpen) {
      setIsOpen(false)
    }
  }

  const moveFireflies = (event) => {
    setMousePosition({
      x: event.clientX,
      y: event.clientY,
    })
  }

  const copyLink = async (event) => {
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

  return (
    <div
      onClick={closeEnvelope}
      onMouseMove={moveFireflies}
      onMouseLeave={() => setMousePosition({ x: -9999, y: -9999 })}
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 px-4 py-10"
    >
      <div className="absolute inset-0">
        {stars.map((style, index) => (
          <span
            key={`star-${index}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={style}
          />
        ))}
      </div>

      <div className="absolute top-8 right-8 sm:top-12 sm:right-12 md:top-16 md:right-16 h-24 w-24 sm:h-32 sm:w-32 md:h-40 md:w-40 rounded-full bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 shadow-[0_0_80px_30px_rgba(254,249,195,0.35)] animate-moon" />

      <div className="absolute inset-0">
        {fireflies.map((firefly, index) => {
          const fireflyX =
            typeof window !== "undefined"
              ? (firefly.leftValue / 100) * window.innerWidth
              : 0
          const fireflyY =
            typeof window !== "undefined"
              ? (firefly.topValue / 100) * window.innerHeight
              : 0

          const distanceX = fireflyX - mousePosition.x
          const distanceY = fireflyY - mousePosition.y
          const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
          const range = 150
          const strength = Math.max(0, (range - distance) / range)
          const angle = Math.atan2(distanceY, distanceX)
          const moveX = Math.cos(angle) * strength * 55
          const moveY = Math.sin(angle) * strength * 55

          return (
            <span
              key={`firefly-${index}`}
              className="absolute h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-yellow-300 shadow-[0_0_16px_6px_rgba(253,224,71,0.7)] animate-float firefly-dot"
              style={{
                top: `${firefly.topValue}%`,
                left: `${firefly.leftValue}%`,
                animationDuration: firefly.animationDuration,
                animationDelay: firefly.animationDelay,
                "--firefly-x": `${moveX}px`,
                "--firefly-y": `${moveY}px`,
              }}
            />
          )
        })}
      </div>

      {showCopiedPopup && (
        <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-6 py-3 text-sm font-bold text-blue-700 shadow-[0_12px_35px_rgba(15,23,42,0.35)]">
          Link copied!
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label={isOpen ? "Gift box is open" : "Open gift box"}
        onClick={(event) => {
          event.stopPropagation()
          openEnvelope()
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            openEnvelope()
          }
        }}
        className="relative z-10 envelope-wrap border-0 bg-transparent p-0 cursor-pointer"
      >
        <div className={`gift-box ${isOpen ? "open" : ""}`}>
          <div className="letter">
            <div className="surprise-content">
              <p className="surprise-label">This is for you Adoy &lt;3</p>

              <div
                className="revealed-link-text"
                onClick={(event) => event.stopPropagation()}
              >
                {link}
              </div>

              <button
                type="button"
                onClick={copyLink}
                onMouseDown={(event) => event.stopPropagation()}
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
          <div className="heart-seal" />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% {
            transform: translate(var(--firefly-x, 0px), var(--firefly-y, 0px)) scale(1);
            opacity: 0.4;
          }
          25% {
            transform: translate(calc(var(--firefly-x, 0px) + 35px), calc(var(--firefly-y, 0px) - 45px)) scale(1.2);
            opacity: 1;
          }
          50% {
            transform: translate(calc(var(--firefly-x, 0px) - 25px), calc(var(--firefly-y, 0px) - 80px)) scale(0.9);
            opacity: 0.7;
          }
          75% {
            transform: translate(calc(var(--firefly-x, 0px) - 45px), calc(var(--firefly-y, 0px) + 25px)) scale(1.15);
            opacity: 1;
          }
          100% {
            transform: translate(var(--firefly-x, 0px), var(--firefly-y, 0px)) scale(1);
            opacity: 0.4;
          }
        }

        @keyframes moon {
          0% {
            transform: translateY(0) scale(1);
            box-shadow: 0 0 80px 30px rgba(254, 249, 195, 0.35);
          }
          50% {
            transform: translateY(-14px) scale(1.04);
            box-shadow: 0 0 110px 40px rgba(254, 249, 195, 0.5);
          }
          100% {
            transform: translateY(0) scale(1);
            box-shadow: 0 0 80px 30px rgba(254, 249, 195, 0.35);
          }
        }

        @keyframes envelope-breathe {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.03);
          }
        }

        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .firefly-dot {
          transition:
            top 0.45s ease-out,
            left 0.45s ease-out,
            filter 0.35s ease-out;
          will-change: transform;
        }

        .animate-moon {
          animation-name: moon;
          animation-duration: 6s;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }

        .envelope-wrap {
          width: 510px;
          height: 390px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: envelope-breathe 5s ease-in-out infinite;
        }

        .gift-box {
          position: relative;
          width: 470px;
          height: 330px;
          filter: drop-shadow(0 30px 38px rgba(15, 23, 42, 0.5));
          perspective: 1000px;
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

        @media (max-width: 640px) {
          @keyframes float {
            0% {
              transform: translate(var(--firefly-x, 0px), var(--firefly-y, 0px)) scale(1);
              opacity: 0.4;
            }
            25% {
              transform: translate(calc(var(--firefly-x, 0px) + 18px), calc(var(--firefly-y, 0px) - 25px)) scale(1.15);
              opacity: 1;
            }
            50% {
              transform: translate(calc(var(--firefly-x, 0px) - 15px), calc(var(--firefly-y, 0px) - 45px)) scale(0.9);
              opacity: 0.7;
            }
            75% {
              transform: translate(calc(var(--firefly-x, 0px) - 22px), calc(var(--firefly-y, 0px) + 18px)) scale(1.1);
              opacity: 1;
            }
            100% {
              transform: translate(var(--firefly-x, 0px), var(--firefly-y, 0px)) scale(1);
              opacity: 0.4;
            }
          }

          @keyframes moon {
            0% {
              transform: translateY(0) scale(1);
              box-shadow: 0 0 55px 20px rgba(254, 249, 195, 0.3);
            }
            50% {
              transform: translateY(-8px) scale(1.03);
              box-shadow: 0 0 75px 28px rgba(254, 249, 195, 0.45);
            }
            100% {
              transform: translateY(0) scale(1);
              box-shadow: 0 0 55px 20px rgba(254, 249, 195, 0.3);
            }
          }

          .envelope-wrap {
            width: 340px;
            height: 285px;
          }

          .gift-box {
            width: 325px;
            height: 242px;
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
        }
      `}</style>
    </div>
  )
}

export default Surprise