import Countdown from 'react-countdown';

function CountDown({ date }) {
    // Completionist message
    const Completionist = () => <span>Verification Code no longer valid!</span>;

    // Renderer for displaying the countdown
    const renderer = ({ hours, minutes, seconds, completed }) => {
        if (completed) {
            // Render a complete state
            return <Completionist />;
        } else {
            // Render a countdown
            return (
                <span>
                    {hours < 10 ? `0${hours}` : hours}:{minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}`:seconds}
                </span>
            );
        }
    };

    return (
        <Countdown date={date} renderer={renderer} />
    );
}

export default CountDown;
