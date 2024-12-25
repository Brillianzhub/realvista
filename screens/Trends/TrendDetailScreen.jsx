import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { formatCurrency } from '../../utils/formatCurrency';
import { useCurrency } from '../../context/CurrencyContext';


const TrendDetailScreen = ({ route }) => {
    const { report } = route.params;
    const { currency } = useCurrency();

    const renderRow = (key, value) => (
        <View style={styles.row}>
            <Text style={styles.keyText}>{key}</Text>
            <Text style={styles.valueText}>{value}</Text>
        </View>
    );

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>General Information</Text>
                {renderRow('Location', report.location)}
                {renderRow('Property Type', report.property_type)}
                {renderRow('Generated Date', new Date(report.generated_date).toLocaleDateString())}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Key Statistics</Text>
                {renderRow('Average Sale Price', formatCurrency(report.key_statistics.average_sale_price, currency))}
                {renderRow('Average Rental Price', formatCurrency(report.key_statistics.average_rental_price, currency))}
                {renderRow('Supply', report.key_statistics.supply)}
                {renderRow('Demand', report.key_statistics.demand)}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Price Trends</Text>
                {renderRow('Year Over Year Change', `${report.price_trends.year_over_year_change}%`)}
                {renderRow('Month Over Month Change', `${report.price_trends.month_over_month_change}%`)}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Neighborhood Insights</Text>
                {renderRow('Walkability Score', report.neighborhood_insights.walkability_score)}
                {renderRow(
                    'Amenities',
                    report.neighborhood_insights.amenities
                        ? JSON.stringify(report.neighborhood_insights.amenities)
                        : 'N/A'
                )}
                {renderRow('Crime Rate', report.neighborhood_insights.crime_rate)}
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Forecast</Text>
                {renderRow('Predicted Sale Price', formatCurrency(report.forecast.predicted_sale_price, currency))}
                {renderRow('Predicted Rental Price', formatCurrency(report.forecast.predicted_rental_price, currency))}
                {renderRow('Forecast Date', new Date(report.forecast.forecast_date).toLocaleDateString())}
            </View>
        </ScrollView>
    );
};

export default TrendDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgba(53, 139, 139, 1)',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    keyText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    valueText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FB902E',
        flex: 1,
        textAlign: 'right',
    },
});
