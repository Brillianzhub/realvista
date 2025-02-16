import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';


const ReportList = ({ reports, handleReportPress }) => {

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <View style={styles.listContainer}>
            {reports.map((item) => (
                <TouchableOpacity
                    key={item.id.toString()}
                    style={styles.reportItem}
                    onPress={() => handleReportPress(item)}
                >
                    <Text style={styles.reportTitle}>{item.title}</Text>

                    <View style={styles.rowContainer}>
                        <Text style={styles.reportBody} numberOfLines={5}>
                            {item.body}
                        </Text>
                        {item.url && <Image source={{ uri: item.attachment }} style={styles.reportImage} />}
                    </View>

                    <View style={styles.reportMetaContainer}>
                        <View style={styles.metaItem}>
                            <Icon name="calendar" size={14} color="#888" />
                            <Text style={styles.reportDate}>
                                {formatDate(item.date_created)}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="tags" size={14} color="#888" />
                            <Text style={styles.reportDate}>{item.category}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="eye" size={14} color="#888" />
                            <Text style={styles.reportViews}>{item.views}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

export default ReportList;


const styles = StyleSheet.create({
    listContainer: {
        paddingTop: 10,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    reportBody: {
        fontSize: 14,
        color: '#666',
        lineHeight: 24,
        flex: 1,
    },
    reportItem: {
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#F9F9F9',
        padding: 10,
    },
    reportTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    reportImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    reportMetaContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 15,
        marginTop: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reportDate: {
        color: '#888',
        marginLeft: 5,
    },
    reportViews: {
        color: '#888',
        marginLeft: 5,
    },
})