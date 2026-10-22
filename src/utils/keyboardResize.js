// Return a bounded resize value for supported keys; leave other keys untouched.
// Each key press commits a discrete preference, independently of pointer drags.
export default function keyboardResize(event, {
    value,
    minimum,
    maximum,
    step,
    increaseKey,
    decreaseKey,
}) {
    let nextValue

    switch (event.key) {
        case increaseKey:
            nextValue = value + step
            break
        case decreaseKey:
            nextValue = value - step
            break
        case "Home":
            nextValue = minimum
            break
        case "End":
            nextValue = maximum
            break
        default:
            return null
    }

    event.preventDefault()
    return Math.min(maximum, Math.max(minimum, nextValue))
}
