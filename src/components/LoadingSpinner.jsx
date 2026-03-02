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
                <div className={`${sizes[size]} rounded-full border-2 border-primary-500/20 border-t-primary-500 animate-spin`} />
                <div className={`absolute inset-0 ${sizes[size]} rounded-full border-2 border-purple-500/20 border-b-purple-500 animate-spin`}
                    style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
                />
            </div>
            {text && <p className="text-dark-400 text-sm animate-pulse">{text}</p>}
        </div>
    )
}
