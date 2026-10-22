// Consistent outline devices inherit toolbar color instead of platform emoji.
function DeviceIcon({ deviceId }) {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            focusable="false"
        >
            {deviceId === "desktop" ? (
                <>
                    <rect x="3" y="4" width="18" height="13" rx="2" />
                    <path d="M12 17v4m-4 0h8" />
                </>
            ) : (
                <>
                    <rect
                        x={deviceId === "tablet" ? 4 : 7}
                        y="2"
                        width={deviceId === "tablet" ? 16 : 10}
                        height="20"
                        rx="2"
                    />
                    <path d="M11 18.5h2" />
                </>
            )}
        </svg>
    )
}

export default DeviceIcon
