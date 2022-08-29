import { useEffect } from "react";
import SwiperClass from "swiper/types/swiper-class"

function KeyboardControl({
    swiper,
    enabled = false
}: {
    swiper: SwiperClass | null,
    enabled?: boolean
}) {

    useEffect(() => {
        if (!swiper) return;
        if (!enabled) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!swiper) return;
            if (e.key === "ArrowLeft") {
                swiper.slidePrev(80);
            } else if (e.key === "ArrowRight") {
                swiper.slideNext(80);
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [swiper, enabled]);

    return null;
}

export default KeyboardControl;