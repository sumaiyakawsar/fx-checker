// Returns true if the event's target is a field the user is actively typing into
// (so global shortcuts like "/" and "s" don't fire while typing).
export function isTypingTarget(target) {
    if (!target) return false;
    const tag = target.tagName;
    return (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        target.isContentEditable
    );
}