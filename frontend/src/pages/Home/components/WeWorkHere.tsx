import { SUPABASE_ANON_KEY, SUPABASE_COMPANIES_BUCKET, SUPABASE_URL } from "../../../utils/constants"
import { useEffect, useState, useRef } from "react"

interface CompanyImage {
    name: string
    url: string
}

const CompanyLogos = () => {
    const [companyImages, setCompanyImages] = useState<CompanyImage[]>([])
    const [loading, setLoading] = useState(true)
    const [isVisible, setIsVisible] = useState(false)
    const logosContainerRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        const el = logosContainerRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1, rootMargin: '50px' }
        );

        observer.observe(el);
        return () => observer.unobserve(el);
        // Re-run when images arrive (or when loading flips)
    }, [companyImages.length, loading]);

    useEffect(() => {
        // Intersection Observer for scroll-triggered animations
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting)
            },
            {
                threshold: 0.1, // Trigger when 10% of the element is visible
                rootMargin: '50px' // Start animation 50px before element comes into view
            }
        )

        // Observe the logos container using ref
        if (logosContainerRef.current) {
            observer.observe(logosContainerRef.current)
        }

        return () => {
            if (logosContainerRef.current) {
                observer.unobserve(logosContainerRef.current)
            }
        }
    }, [])

    useEffect(() => {
        const fetchCompanyImages = async () => {
            try {

                const res = await fetch(`${SUPABASE_URL}/storage/v1/object/list/${SUPABASE_COMPANIES_BUCKET}`, {
                    method: 'POST',
                    headers: {
                        apikey: SUPABASE_ANON_KEY,
                        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prefix: '',
                        limit: 100,
                        offset: 0,
                        sortBy: { column: 'name', order: 'asc' },
                    }),
                });

                const data = await res.json(); // [{ name, id, updated_at, ... }]


                if (data && data.length > 0) {
                    const imageUrls = data
                        .filter((file: any) => file.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i))
                        .map((file: any) => ({
                            name: file.name,
                            url: `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_COMPANIES_BUCKET}/${file.name}`
                        }))

                    setCompanyImages(imageUrls)
                }
            } catch (error) {
            } finally {
                setLoading(false)
            }
        }

        fetchCompanyImages()
    }, [])

    if (loading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-flat-gold"></div>
            </div>
        )
    }

    if (companyImages.length === 0) {
        return null
    }

    return (
        <div ref={logosContainerRef} className="w-full overflow-hidden bg-white">
            <div
                className={`flex animate-scroll-left space-x-4 sm:space-x-6 md:space-x-8 transition-all duration-1000 ease-out ${isVisible
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
            >
                {[...companyImages, ...companyImages].map((image, index) => (
                    <div key={`${image.name}-${index}`} className="flex-shrink-0">
                        <img
                            src={image.url}
                            alt={`Company logo ${image.name}`}
                            className="h-50 w-auto object-contain transition-all duration-300"
                            loading="lazy"
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}

export const WeWorkHere = () => {
    return (
        <div className="border-y-6 border-flat-gold bg-gray-200 py-5 sm:py-8 md:py-10 text-xl sm:text-2xl md:text-3xl text-custom-black text-center dark:text-custom-black leading-relaxed px-4">
            <div className="text-5xl font-bold text-flat-gold mb-8 sm:mb-10 md:mb-12">
                We Work Here
            </div>
            <CompanyLogos />
        </div>
    )
}