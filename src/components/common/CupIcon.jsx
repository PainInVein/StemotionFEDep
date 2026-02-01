import React from 'react'

export default function CupIcon() {
    return (
        <svg
            className="w-8 h-8 md:w-10 md:h-10"
            viewBox="0 0 51 51"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* LEFT HANDLE (moved right a bit) */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4.8 7.2H12.9V19.6H4.8V7.2ZM7.1 9.5H10.6V17.3H7.1V9.5Z"
                fill="#F7C325"
            />

            {/* RIGHT HANDLE (moved left a bit) */}
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M38.1 7.2H46.2V19.6H38.1V7.2ZM40.4 9.5H43.9V17.3H40.4V9.5Z"
                fill="#F7C325"
            />

            {/* CUP BODY (giữ nguyên) */}
            <path
                d="M10.6104 4.75192L39.4246 4.18875L39.7525 21.2146L25.5019 29.3536L10.9452 21.7762L10.6104 4.75192Z"
                fill="#F7C325"
            />
            <path
                d="M24.0434 21.521L26.6617 21.4701L26.9165 34.5661L24.2983 34.617L24.0434 21.521Z"
                fill="#F7C325"
            />
            <path
                d="M13.8186 34.8222L37.3895 34.3622L37.5714 43.5291L14.0006 43.989L13.8186 34.8222Z"
                fill="#383838"
            />
            <path
                d="M26.037 8.07167C26.4371 7.56791 27.2512 7.92098 27.1523 8.55841L26.4746 12.9693L29.5125 12.9351C30.305 12.9267 30.7542 13.8434 30.2635 14.4643L25.3283 20.6693C24.9283 21.1738 24.1139 20.82 24.2129 20.1833L24.8906 15.7724L21.8527 15.8059C21.0601 15.8143 20.6112 14.8983 21.1019 14.2774L26.037 8.07167Z"
                fill="#D7A613"
            />
        </svg>
    )
}
