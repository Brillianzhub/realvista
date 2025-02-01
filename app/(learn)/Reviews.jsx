import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import WriteReview from '../../screens/Learn/WriteReview';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Reviews = () => {
    const { courseId } = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {

            const token = await AsyncStorage.getItem('authToken');

            const response = await axios.get(`https://realvistamanagement.com/courses/fetch-reviews/${courseId}/`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );

            if (Array.isArray(response.data)) {
                setReviews(response.data);
            } else {
                setReviews([]);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };


    useEffect(() => {
        fetchReviews();
    }, [courseId]);


    const handleVote = async (reviewId, voteType) => {
        try {
            const token = await AsyncStorage.getItem('authToken');

            const response = await axios.post(
                `https://realvistamanagement.com/courses/reviews/${reviewId}/${voteType}/`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`,
                    },
                }
            );
            fetchReviews();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchReviews();
    };

    const averageRating =
        reviews && reviews.length > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
            : 0;

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i <= rating ? 'star' : 'star-o'}
                    size={16}
                    color={i <= rating ? '#FFD700' : '#ccc'}
                />
            );
        }
        return stars;
    };

    const renderReviewItem = (item) => (
        <View style={styles.reviewItem} key={item.id.toString()}>
            <View style={styles.userInfo}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/40' }}
                    style={styles.avatar}
                />
                <View style={styles.userDetails}>
                    <Text style={styles.userName}>{item.user_name}</Text>
                    <Text style={styles.dateText}>
                        {new Date(item.created_at).toLocaleDateString()}
                    </Text>
                </View>
                <View style={styles.ratingContainer}>
                    {renderStars(item.rating)}
                </View>
            </View>
            <Text style={styles.commentText}>{item.comment}</Text>

            {/* Voting Section */}
            <View style={styles.votingContainer}>
                <TouchableOpacity onPress={() => handleVote(item.id, 'upvote')}>
                    <FontAwesome name="thumbs-up" size={20} color={item.user_vote === 'upvote' ? '#358B8B' : '#ccc'} />
                </TouchableOpacity>
                <Text style={styles.voteCount}>{item.upvotes}</Text>

                <TouchableOpacity onPress={() => handleVote(item.id, 'downvote')}>
                    <FontAwesome name="thumbs-down" size={20} color={item.user_vote === 'downvote' ? '#358B8B' : '#ccc'} />
                </TouchableOpacity>
                <Text style={styles.voteCount}>{item.downvotes}</Text>
            </View>
        </View>
    );

    return (
        <LinearGradient colors={['#f9f9f9', '#eaeaea']} style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#358B8B']}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <ActivityIndicator size="large" color="#358B8B" style={styles.loadingIndicator} />
                ) : (
                    <>
                        <View style={styles.averageRatingContainer}>
                            <Text style={styles.averageRatingText}>{averageRating.toFixed(1)}</Text>
                            <View style={styles.starsContainer}>{renderStars(averageRating)}</View>
                        </View>

                        <View style={styles.gradeScaleContainer}>
                            <Text style={styles.gradeScaleTitle}>Grade Distribution</Text>
                            {[
                                { label: 'Excellent', value: 'excellent' },
                                { label: 'Good', value: 'good' },
                                { label: 'Average', value: 'average' },
                                { label: 'Below Average', value: 'below_average' },
                                { label: 'Poor', value: 'poor' },
                            ].map((grade) => {
                                const count = (reviews || []).filter((r) => r.grade === grade.value).length;
                                const percentage = (count / (reviews?.length || 1)) * 100 || 0;

                                return (
                                    <View key={grade.value} style={styles.gradeScaleItem}>
                                        <Text style={styles.gradeScaleLabel}>{grade.label}</Text>
                                        <View style={styles.gradeScaleBar}>
                                            <View
                                                style={[
                                                    styles.gradeScaleFill,
                                                    { width: `${percentage}%` },
                                                ]}
                                            />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        {(reviews || []).length > 0 ? (
                            reviews.map((item) => renderReviewItem(item))
                        ) : (
                            <Text style={styles.noReviewsText}>No reviews available.</Text>
                        )}
                    </>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.writeReviewButton}
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.writeReviewButtonText}>Write a Review</Text>
            </TouchableOpacity>

            <WriteReview
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                courseId={courseId}
                onReviewSubmit={fetchReviews}
            />

        </LinearGradient>
    );
};

export default Reviews;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    scrollContainer: {
        flexGrow: 1,
    },
    averageRatingContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    averageRatingText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FB902E',
    },
    starsContainer: {
        flexDirection: 'row',
        marginTop: 8,
    },
    gradeScaleContainer: {
        marginBottom: 20,
    },
    gradeScaleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    gradeScaleItem: {
        marginBottom: 8,
    },
    gradeScaleLabel: {
        fontSize: 14,
        color: '#666',
    },
    gradeScaleBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginTop: 4,
        overflow: 'hidden',
    },
    gradeScaleFill: {
        height: '100%',
        backgroundColor: '#358B8B',
        borderRadius: 4,
    },
    reviewItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    ratingContainer: {
        flexDirection: 'row',
    },
    commentText: {
        fontSize: 14,
        color: '#333',
    },
    noReviewsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 20,
    },
    writeReviewButton: {
        backgroundColor: '#FB902E',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    writeReviewButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    votingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    voteCount: {
        marginHorizontal: 10,
        fontSize: 16,
        color: '#333',
    },
});