interface JoinUsProps {
    opt?: string
}
export const JoinUs = ({ opt }: JoinUsProps) => {
    return <a
        href="https://forms.google.com/fake-join-form"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 px-8 py-4 bg-flat-gold hover:bg-flat-gold-hover text-white font-bold text-2xl rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out border-2 border-transparent hover:border-white/20"
    >
        Join {`${opt}`}
        <svg
            className="w-8 h-8 transform group-hover:translate-x-2 transition-transform duration-300 ease-in-out"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
        </svg>
    </a>
}

export default JoinUs;