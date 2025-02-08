import React, { useRef } from "react";
import { Animated, PanResponder, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const window = Dimensions.get("window");

const DraggableAddButton = ({ handleAddProperty }) => {
    const pan = useRef(new Animated.ValueXY({ x: 20, y: 500 })).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                pan.extractOffset(); // Reset the offset for a fresh drag
            },
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (e, gesture) => {
                pan.flattenOffset();

                const boundedX = Math.max(0, Math.min(pan.x._value, window.width - 60));
                const boundedY = Math.max(0, Math.min(pan.y._value, window.height - 60));

                Animated.spring(pan, {
                    toValue: { x: boundedX, y: boundedY },
                    useNativeDriver: false,
                }).start();
            },
        })
    ).current;

    return (
        <Animated.View
            style={[
                styles.addButton,
                {
                    transform: [{ translateX: pan.x }, { translateY: pan.y }],
                },
            ]}
            {...panResponder.panHandlers}
        >
            <TouchableOpacity onPress={handleAddProperty}>
                <Ionicons name="add" size={30} color="white" />
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    addButton: {
        position: "absolute",
        backgroundColor: "#FB902E",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
});

export default DraggableAddButton;
