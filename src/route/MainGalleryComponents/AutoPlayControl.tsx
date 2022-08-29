import { useEffect } from "react";
import SwiperClass from "swiper/types/swiper-class"

function AutoplayControl({
    swiper,
    enabled = false
}: {
    swiper: SwiperClass | null,
    enabled?: boolean
}) {

    useEffect(() => {
        if (!swiper) return;
        // console.log(swiper);
        if (enabled) {
            swiper?.autoplay?.start();
        } else {
            swiper?.autoplay?.stop();
        }
    }, [swiper, enabled]);

    return null;
}

export default AutoplayControl;