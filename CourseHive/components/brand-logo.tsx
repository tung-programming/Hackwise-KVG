import Image from 'next/image'
import Link from 'next/link'

type BrandLogoProps = {
  href?: string
  width?: number
  height?: number
  priority?: boolean
  className?: string
}

export function BrandLogo({
  href,
  width = 210,
  height = 62,
  priority = false,
  className = '',
}: BrandLogoProps) {
  const logo = (
    <Image
      src="/LOGO.jpeg"
      alt="CourseHive"
      width={width}
      height={height}
      priority={priority}
      sizes={`${width}px`}
      style={{ width: `${width}px`, height: `${height}px` }}
      className={`shrink-0 object-contain ${className}`}
    />
  )

  if (!href) return logo

  return (
    <Link href={href} className="inline-flex items-center shrink-0">
      {logo}
    </Link>
  )
}
