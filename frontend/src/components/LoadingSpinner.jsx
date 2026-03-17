export default function LoadingSpinner({ size = 'md', text = '' }) {
    const sizes = {
        sm: 'w-5 h-5',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className={`${sizes[size]} rounded-full border-2 border-[#67829e]/20 border-t-[#67829e] animate-spin`} />
                <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-teal-400/20 border-b-teal-400 animate-spin`}
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                />
            </div>
            {text && <p className="text-slate-500 text-sm animate-pulse">{text}</p>}
        </div>
    )
}
