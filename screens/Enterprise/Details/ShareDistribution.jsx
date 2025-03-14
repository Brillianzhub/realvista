import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import useManageBookings from '@/hooks/useManageBookings';

const ShareDistribution = ({ property }) => {
    const { bookings } = useManageBookings(property.id);
    const totalSlots = property.total_slots;

    // Filter bookings with status "booked"
    const bookedSlots = bookings.filter(booking => booking.status === "booked");

    // Aggregate slots for the same user (using email as the unique identifier)
    const aggregatedSlots = {};
    bookedSlots.forEach(booking => {
        if (aggregatedSlots[booking.user]) {
            aggregatedSlots[booking.user] += booking.slots_owned; // Add slots if user already exists
        } else {
            aggregatedSlots[booking.user] = booking.slots_owned; // Initialize if user doesn't exist
        }
    });

    // Calculate the total slots booked
    const totalBookedSlots = Object.values(aggregatedSlots).reduce((sum, slots) => sum + slots, 0);

    // Calculate available slots
    const availableSlots = totalSlots - totalBookedSlots;

    // Function to generate a valid random color
    const generateRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor.padStart(6, '0')}`; 
    };

    const getFirstName = (userName) => {
        return userName.split(' ')[0];
    };

    const chartData = Object.keys(aggregatedSlots).map(user => ({
        name: `${getFirstName(bookedSlots.find(booking => booking.user === user).user_name)} (${((aggregatedSlots[user] / totalSlots) * 100).toFixed(2)}%)`,
        population: aggregatedSlots[user],
        color: generateRandomColor(),
        legendFontColor: '#7F7F7F',
        legendFontSize: 8
    }));

    if (availableSlots > 0) {
        chartData.push({
            name: `Available (${((availableSlots / totalSlots) * 100).toFixed(2)}%)`,
            population: availableSlots,
            color: '#CCCCCC',
            legendFontColor: '#7F7F7F',
            legendFontSize: 8
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ownership Distribution</Text>
            <PieChart
                data={chartData}
                width={300}
                height={200}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'left',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 10,
        marginTop: 20
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    }
});

export default ShareDistribution;