import { Animated } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

interface SwipeableCProps {
    children: React.ReactNode;
    rightActions?: (
        progressAnimatedValue?: Animated.AnimatedInterpolation<string | number>,
        dragAnimatedValue?: Animated.AnimatedInterpolation<string | number>,
        swipeable?: Swipeable
    ) => React.ReactNode;
    data?: any;
}

const SwipeableC: React.FC<SwipeableCProps> = ({ children, rightActions, data }) => {
    return (
        <Swipeable
            renderRightActions={(progress, drag, swipeable) => rightActions?.(progress, drag, swipeable, data)}
        >
            {children}
        </Swipeable>
    );
};

export default SwipeableC;
