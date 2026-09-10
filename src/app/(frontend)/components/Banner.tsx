import Image from 'next/image'
import { RichText } from '@payloadcms/richtext-lexical/react'

interface BannerProps {
  title: any
  imageUrl: string
  altText?: string
}

export default function Banner({ title, imageUrl, altText = 'Banner image' }: BannerProps) {
  return (
    // 1. Contenedor principal: relative para contener la imagen flotante
    <div className="relative w-full min-h-[400px] md:h-[500px] flex items-center overflow-hidden">
      {/* 2. Imagen: Ocupa el 100% del contenedor */}
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={altText}
          fill
          className="object-cover object-center z-0"
          priority
        />
      )}

      {/* 3. Título: Flota en la capa superior (z-10) y se restringe a la mitad izquierda (md:w-1/2) */}
      <div className="relative z-10 w-full md:w-[55%] lg:w-[60%] pl-10 pr-4 md:pl-20 md:pr-8 lg:pl-32 lg:pr-8 flex flex-col justify-center">
        <div
          className="text-3xl lg:text-[44px] font-bold text-white leading-tight 
                        [&_p]:m-0 
                        [&_strong]:text-[#0f4] [&_strong]:font-bold"
        >
          {title && <RichText data={title} />}
        </div>
      </div>
    </div>
  )
}
