import React from 'react';
import {useWindowSize} from 'react-use'
import Confetti from 'react-confetti'

import {addConfettiListener, removeConfettiListener} from "@/app/lib/confetti";

export default function AppConfetti() {
    const [confettiCount, setConfettiCount] = React.useState<number>(0);

    const startConfetti = React.useCallback((event: CustomEvent<number>) => {
        setConfettiCount((currentCount) => currentCount + (event.detail ?? 500))
    }, [setConfettiCount]);

    React.useEffect(() => {
        addConfettiListener(startConfetti);
        return () => removeConfettiListener(startConfetti);
    }, [startConfetti]);

    const {width, height} = useWindowSize()

    return (
        <Confetti
            suppressHydrationWarning={true}
            style={{pointerEvents: 'none'}}
            width={width}
            height={height}
            numberOfPieces={confettiCount}
            tweenDuration={200}
            recycle={false}
            onConfettiComplete={(confetti: any) => {
                setConfettiCount(0)
                confetti.reset()
            }}
        />
    )
}
