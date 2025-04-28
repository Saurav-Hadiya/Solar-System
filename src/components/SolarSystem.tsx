'use client';

import { useEffect, useRef, useState } from "react"

function loadImages(
    setImages: React.Dispatch<React.SetStateAction<
        { sun: HTMLImageElement | null, earth: HTMLImageElement | null, moon: HTMLImageElement | null }
    >>
) {
    const sun = new Image();
    const earth = new Image();
    const moon = new Image();

    sun.src = '/sun.png'
    earth.src = '/earth.jpg'
    moon.src = '/moon.jpg'

    sun.onload = () => {
        setImages((prev) => ({ ...prev, sun }))
    }

    earth.onload = () => {
        setImages((prev) => ({ ...prev, earth }))
    }

    moon.onload = () => {
        setImages((prev) => ({ ...prev, moon }))
    }
}

let earthAngle = 0
let moonAngle = 0

function drawSolar(
    ctx: CanvasRenderingContext2D,
    canvasWidth: number,
    canvasHeight: number,
    images: { sun: HTMLImageElement | null, earth: HTMLImageElement | null, moon: HTMLImageElement | null }) {

    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    const earthOrbitRadius = Math.min(canvasWidth, canvasHeight) / 3
    const moonOrbitRadius = earthOrbitRadius / 2.5

    // draw earth orbit
    ctx.beginPath()
    ctx.strokeStyle = '#fff'
    // ctx.arc(canvasWidth / 2, canvasHeight / 2, earthOrbitRadius, 0, 2 * Math.PI)
    ctx.stroke()

    // draw sun
    if (images.sun) {
        const sunWidth = Math.min(canvasWidth, canvasHeight) * 0.2    // 20% from minimum of canvasWidth or canvasHeight  
        const sunHeight = sunWidth
        const sunX = (canvasWidth - sunWidth) / 2
        const sunY = (canvasHeight - sunHeight) / 2
        ctx.drawImage(images.sun, sunX, sunY, sunWidth, sunHeight)
    }

    // draw earth
    if (images.earth && images.moon) {
        ctx.save()

        // origin shifted to center of canvas
        ctx.translate(canvasWidth / 2, canvasHeight / 2)

        const earthWidth = Math.min(canvasWidth, canvasHeight) * 0.1    // 10% from minimum of canvasWidth or canvasHeight  
        const earthHeight = earthWidth

        const earthX = Math.cos(earthAngle) * earthOrbitRadius - earthWidth / 2
        const earthY = Math.sin(earthAngle) * earthOrbitRadius - earthHeight / 2

        // draw earth
        ctx.drawImage(images.earth, earthX, earthY, earthWidth, earthHeight)

        // origin shifted to center of earth 
        ctx.translate(earthX + earthWidth / 2, earthY + earthWidth / 2)

        // Draw Moon Orbit
        ctx.beginPath();
        ctx.strokeStyle = "red";
        // ctx.arc(0, 0, moonOrbitRadius, 0, 2 * Math.PI);
        ctx.stroke();

        const moonWidth = Math.min(canvasWidth, canvasHeight) * 0.05    // 5% from minimum of canvasWidth or canvasHeight
        const moonHeight = moonWidth;

        const moonX = Math.cos(moonAngle) * moonOrbitRadius - moonWidth / 2
        const moonY = Math.sin(moonAngle) * moonOrbitRadius - moonHeight / 2

        // Draw moon
        ctx.drawImage(images.moon, moonX, moonY, moonWidth, moonHeight)

        ctx.restore();
    }

    earthAngle += 0.009
    moonAngle += 0.02
    window.requestAnimationFrame(() => (drawSolar(ctx, canvasWidth, canvasHeight, images)))
}

const SolarSystem = () => {
    const [images, setImages] = useState<{ sun: HTMLImageElement | null, earth: HTMLImageElement | null, moon: HTMLImageElement | null }>(
        { sun: null, earth: null, moon: null }
    )
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (images.sun && images.earth && images.moon) {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx && canvas) {
                drawSolar(ctx, canvas?.width, canvas?.height, images)
            }
        }
    }, [images])

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = canvas.clientWidth
            canvas.height = canvas.clientHeight

            const ctx = canvas?.getContext('2d');
            if (!ctx) return

            loadImages(setImages)
        }
    }, [])

    return (
        <div className="bg-[url('/solar.jpg')] w-full h-full">
            <canvas ref={canvasRef} className="w-full h-full"></canvas>
        </div>
    )
}

export default SolarSystem