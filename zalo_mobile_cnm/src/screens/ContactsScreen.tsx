import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  Image, 
  ActivityIndicator,
  Alert
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { RootState } from '../redux/reducers';
import { getAllFriendRequest, searchUserRequest } from '../redux/actions/UserAction';
import { FriendItem } from '../types/UserType';

type ContactsScreenProps = {
  navigation: any;
};

const ContactsScreen = ({ navigation }: ContactsScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  
  // Using type casting to avoid TypeScript errors
  const userState = useSelector((state: RootState) => state.user) as {
    userCurrent: any;
    friends: any[];
    isLoading: boolean;
    result: any;
  };
  
  const { userCurrent, friends, isLoading } = userState;
  const resultSearch = userState.result;
  
  // Lấy danh sách bạn bè khi màn hình được tải
  useEffect(() => {
    if (userCurrent && userCurrent._id) {
      dispatch(getAllFriendRequest(userCurrent._id));
    }
  }, [dispatch, userCurrent]);
  
  // Hàm xử lý tìm kiếm người dùng
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    dispatch(searchUserRequest({ 
      query: searchQuery,
      userId: userCurrent?._id
    }));
  };
  
  // Hàm xử lý khi chọn một người bạn để chat
  const handleSelectContact = (contact: FriendItem) => {
    if (contact && contact.idConversation) {
      // Nếu đã có cuộc trò chuyện, điều hướng đến màn hình chat
      navigation.navigate('Chat', {
        conversationId: contact.idConversation,
        userId: userCurrent?._id || '',
        name: contact.idUser.name,
        avatar: contact.idUser.avatar ? { uri: contact.idUser.avatar } : require('../assets/avatar.jpg'),
      });
    } else {
      // Nếu chưa có cuộc trò chuyện, tạo cuộc trò chuyện mới
      // Chức năng này sẽ được triển khai sau
      Alert.alert('Thông báo', 'Đang tạo cuộc trò chuyện mới...');
    }
  };
  
  // Hàm xử lý khi chọn một người dùng từ kết quả tìm kiếm
  const handleSelectSearchResult = (user: any) => {
    if (!user || !userCurrent) return;
    
    if (user._id === userCurrent._id) {
      Alert.alert('Thông báo', 'Không thể tự kết bạn với chính mình.');
      return;
    }
    
    if (user.isFriend) {
      // Nếu đã là bạn bè, điều hướng đến màn hình chat
      // Tìm trong danh sách bạn bè
      const friend = friends.find((f: any) => f.idUser._id === user._id);
      if (friend && friend.idConversation) {
        navigation.navigate('Chat', {
          conversationId: friend.idConversation,
          userId: userCurrent?._id || '',
          name: user.name,
          avatar: user.avatar ? { uri: user.avatar } : require('../assets/avatar.jpg'),
        });
      } else {
        // Nếu chưa có cuộc trò chuyện, tạo cuộc trò chuyện mới
        Alert.alert('Thông báo', 'Đang tạo cuộc trò chuyện mới...');
      }
    } else {
      // Nếu chưa là bạn bè, hiển thị màn hình thông tin người dùng
      navigation.navigate('UserProfile', { user });
    }
  };
  
  // Render một mục trong danh sách bạn bè
  const renderFriendItem = ({ item }: { item: FriendItem }) => (
    <TouchableOpacity 
      style={styles.contactItem}
      onPress={() => handleSelectContact(item)}
    >
      <Image 
        source={
          item.idUser.avatar 
            ? { uri: item.idUser.avatar } 
            : require('../assets/avatar.jpg')
        } 
        style={styles.avatar} 
      />
      <Text style={styles.contactName}>{item.idUser.name}</Text>
    </TouchableOpacity>
  );
  
  // Render một mục trong kết quả tìm kiếm
  const renderSearchResultItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={() => handleSelectSearchResult(item)}
    >
      <Image 
        source={
          item.avatar 
            ? { uri: item.avatar } 
            : require('../assets/avatar.jpg')
        } 
        style={styles.avatar} 
      />
      <View style={styles.searchResultInfo}>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      {item.isFriend ? (
        <TouchableOpacity 
          style={[styles.actionButton, styles.messageButton]}
          onPress={() => handleSelectSearchResult(item)}
        >
          <Text style={styles.actionButtonText}>Nhắn tin</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          style={[styles.actionButton, styles.addButton]}
          onPress={() => navigation.navigate('UserProfile', { user: item })}
        >
          <Text style={styles.actionButtonText}>Xem</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Danh bạ</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="person-add-outline" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Search bar */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên, số điện thoại..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}
          >
            <Ionicons name="close-circle" size={20} color="#777" />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Nếu đang tìm kiếm, hiển thị kết quả tìm kiếm */}
      {isSearching ? (
        <View style={styles.contentContainer}>
          <Text style={styles.sectionTitle}>Kết quả tìm kiếm</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#2483ff" style={styles.loadingIndicator} />
          ) : resultSearch && resultSearch.length > 0 ? (
            <FlatList
              data={resultSearch}
              renderItem={renderSearchResultItem}
              keyExtractor={(item) => item._id}
              contentContainerStyle={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                Không tìm thấy kết quả phù hợp
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.cancelSearchButton}
            onPress={() => {
              setSearchQuery('');
              setIsSearching(false);
            }}
          >
            <Text style={styles.cancelSearchText}>Quay lại danh bạ</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Nếu không tìm kiếm, hiển thị danh sách bạn bè
        <View style={styles.contentContainer}>
          {/* Quản lý bạn bè và yêu cầu kết bạn */}
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('FriendRequests')}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="person-add" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Lời mời kết bạn</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => navigation.navigate('GroupChats')}
            >
              <View style={[styles.actionIconContainer, { backgroundColor: '#4caf50' }]}>
                <Ionicons name="people" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Nhóm chat</Text>
            </TouchableOpacity>
          </View>
          
          {/* Danh sách bạn bè */}
          <Text style={styles.sectionTitle}>Bạn bè ({friends ? friends.length : 0})</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color="#2483ff" style={styles.loadingIndicator} />
          ) : friends && friends.length > 0 ? (
            <FlatList
              data={friends}
              renderItem={renderFriendItem}
              keyExtractor={(item) => item.idUser._id}
              contentContainerStyle={styles.list}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={50} color="#ccc" />
              <Text style={styles.emptyText}>
                Bạn chưa có bạn bè nào
              </Text>
              <Text style={styles.emptySubText}>
                Hãy tìm kiếm và kết bạn với người mới
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 10,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 15,
    marginVertical: 10,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  clearButton: {
    padding: 5,
  },
  contentContainer: {
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  actionCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginRight: 10,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2483ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  actionText: {
    color: '#333',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  list: {
    paddingHorizontal: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
  },
  searchResultInfo: {
    flex: 1,
  },
  contactPhone: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageButton: {
    backgroundColor: '#e3f2fd',
  },
  addButton: {
    backgroundColor: '#2483ff',
  },
  actionButtonText: {
    color: '#2483ff',
    fontWeight: '500',
  },
  loadingIndicator: {
    marginTop: 40,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
  },
  cancelSearchButton: {
    alignItems: 'center',
    padding: 15,
  },
  cancelSearchText: {
    color: '#2483ff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ContactsScreen;