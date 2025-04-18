import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet,
  SafeAreaView, 
  ActivityIndicator,
  Image,
  TextInput
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { getSocket } from '../utils/Socket';
import { RootState } from '../redux/reducers';
import { getAllConversationByUserRequest } from '../redux/actions/ChatAction';
import { IConversation, IChatWith } from '../types/ChatType';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useSocket } from '../contexts/SocketContext';
import LoadingContainer from '../components/LoadingContainer';
import { NavigationHandler } from '../utils/NotificationUtils';

// Extended conversation interface for our usage
interface ExtendedConversation extends Omit<IConversation, 'members'> {
  members: IChatWith[];
  type: 'group' | 'private';
  unreadMessages?: number;
}

type ChatListScreenProps = {
  navigation: any;
};

const ChatListScreen = ({ navigation }: ChatListScreenProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  
  const { userCurrent } = useSelector((state: RootState) => state.user);
  const { conversations: listConversation, isLoadingConversations: isLoading } = useSelector((state: RootState) => state.chat);
  const { isConnected } = useSocket();
  
  // Lấy danh sách cuộc trò chuyện khi màn hình được tải
  useEffect(() => {
    if (userCurrent?._id) {
      dispatch(getAllConversationByUserRequest(userCurrent._id));
    }
  }, [dispatch, userCurrent]);
  
  // Lắng nghe sự kiện socket để cập nhật danh sách chat
  useEffect(() => {
    if (!isConnected) return;
    
    const socket = getSocket();
    if (!socket) return;
    
    const handleNewMessage = () => {
      if (userCurrent?._id) {
        dispatch(getAllConversationByUserRequest(userCurrent._id));
      }
    };
    
    socket.on('new_message', handleNewMessage);
    
    // Also listen for seen_message to update conversation list when messages are seen
    socket.on('seen_message', handleNewMessage);
    
    // Join all conversations the user is part of
    if (Array.isArray(listConversation) && listConversation.length > 0) {
      const conversationIds = listConversation.map(conv => conv._id);
      socket.emit('join_all_conversation', conversationIds);
    }
    
    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('seen_message', handleNewMessage);
    };
  }, [dispatch, userCurrent, isConnected, listConversation]);
  
  // Lọc cuộc trò chuyện theo từ khóa tìm kiếm
  const filteredConversations = searchQuery 
    ? (listConversation as ExtendedConversation[]).filter((conversation) => {
        // Tìm theo tên cuộc trò chuyện hoặc tên thành viên
        if (conversation.type === 'group' && conversation.name) {
          return conversation.name.toLowerCase().includes(searchQuery.toLowerCase());
        } else {
          // Nếu là cuộc trò chuyện 1-1, tìm theo tên người dùng khác
          const otherUser = conversation.members.find(
            (member) => member.idUser._id !== userCurrent._id
          );
          return otherUser?.idUser.name.toLowerCase().includes(searchQuery.toLowerCase());
        }
      })
    : (listConversation as ExtendedConversation[]);
  
  // Hàm xử lý định dạng thời gian
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) {
        // Nếu là hôm nay, hiển thị giờ
        return format(date, 'HH:mm');
      } else if (diffDays === 1) {
        // Nếu là ngày hôm qua
        return 'Hôm qua';
      } else if (diffDays < 7) {
        // Nếu trong tuần này
        return format(date, 'EEEE', { locale: vi });
      } else {
        // Nếu cách đây hơn 1 tuần
        return format(date, 'dd/MM/yyyy');
      }
    } catch (error) {
      return '';
    }
  };
  
  // Hàm lấy thông tin người dùng hoặc nhóm để hiển thị
  const getChatInfo = (conversation: ExtendedConversation) => {
    if (conversation.type === 'group') {
      return {
        name: conversation.name || 'Nhóm không có tên',
        avatar: conversation.avatar || require('../assets/avatar.jpg'),
      };
    } else {
      // Tìm thành viên khác trong cuộc trò chuyện 1-1
      const otherUser = conversation.members.find(
        (member) => member.idUser._id !== userCurrent._id
      );
      
      return {
        name: otherUser?.idUser.name || ' ',
        avatar: otherUser?.idUser.avatar 
          ? { uri: otherUser.idUser.avatar } 
          : require('../assets/avatar.jpg'),
      };
    }
  };
  
  // Hàm xử lý khi chọn một cuộc trò chuyện
  const handleSelectChat = (conversation: ExtendedConversation) => {
    const chatInfo = getChatInfo(conversation);
    
    navigation.navigate('Chat', {
      conversationId: conversation._id,
      userId: userCurrent._id,
      name: chatInfo.name,
      avatar: typeof chatInfo.avatar === 'number' ? chatInfo.avatar : { uri: chatInfo.avatar },
      isGroup: conversation.type === 'group'
    });
  };
  
  // Hàm render một item trong danh sách cuộc trò chuyện
  const renderItem = ({ item }: { item: ExtendedConversation }) => {
    const chatInfo = getChatInfo(item);
    const lastMessage = item.lastMessage?.message || '';
    const time = item.lastMessage?.createdAt 
      ? formatTime(item.lastMessage.createdAt)
      : '';
    
    // Kiểm tra xem tin nhắn cuối cùng đã được xem chưa
    const isUnread = item.lastMessage && 
      item.lastMessage.sender !== userCurrent._id &&
      (item.unreadMessages ? item.unreadMessages > 0 : false);
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => handleSelectChat(item)}
      >
        <Image 
          source={typeof chatInfo.avatar === 'number' ? chatInfo.avatar : { uri: chatInfo.avatar }}
          style={styles.avatar}
        />
        <View style={styles.chatInfo}>
          <View style={styles.chatNameRow}>
            <Text 
              style={[styles.chatName, isUnread && styles.unreadText]}
              numberOfLines={1}
            >
              {chatInfo.name}
            </Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text 
            style={[styles.lastMessage, isUnread && styles.unreadText]}
            numberOfLines={1}
          >
            {item.type === 'group' && item.lastMessage && item.lastMessage.sender !== userCurrent._id ? (
              // Hiển thị người gửi cho tin nhắn nhóm
              <Text>
                {item.members.find((m) => m.idUser._id === item.lastMessage?.sender)?.idUser.name}: {lastMessage}
              </Text>
            ) : (
              lastMessage
            )}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <NavigationHandler />
      <LoadingContainer 
        loadingId="GET_ALL_CONVERSATION" 
        customLoadingMessage="Đang tải cuộc trò chuyện..."
        showOverlay={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="search" size={22} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => {
                // Chức năng tạo nhóm chat mới sẽ được triển khai sau
                // navigation.navigate('CreateGroup'); 
              }}
            >
              <Ionicons name="create-outline" size={22} color="#333" />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm tin nhắn, bạn bè..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#777" />
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.chatList}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={80} color="#ccc" />
                <Text style={styles.emptyText}>
                  {searchQuery.length > 0 
                    ? 'Không tìm thấy kết quả nào' 
                    : 'Chưa có cuộc trò chuyện nào'}
                </Text>
              </View>
            ) : null
          }
        />
      </LoadingContainer>
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
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
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
  chatList: {
    paddingTop: 5,
  },
  chatItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatInfo: {
    flex: 1,
    marginLeft: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 12,
  },
  chatNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  time: {
    fontSize: 12,
    color: '#888',
    marginLeft: 5,
  },
  lastMessage: {
    fontSize: 14,
    color: '#777',
  },
  unreadText: {
    fontWeight: '700',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default ChatListScreen;