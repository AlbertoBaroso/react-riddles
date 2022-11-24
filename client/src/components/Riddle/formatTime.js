export default function formatTime(time) {
    const intTime = parseInt(time);
    const minutes = Math.floor(intTime / 60);
    const seconds = intTime % 60;
    return `${minutes}m ${seconds < 10 ? '0' : ''}${seconds}s`;
}
