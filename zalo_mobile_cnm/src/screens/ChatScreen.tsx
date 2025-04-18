import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { getSocket } from '../utils/Socket';
import { RootState } from '../redux/reducers';
import { getAllMessageByConversationRequest, pushNewMesssgeToListMessage, saveInfoChatWith } from '../redux/actions/ChatAction';
import ChatApi from '../api/ChatApi';
import { IMessage, ISendMessageParams, MessageType } from '../types/ChatType';
import { useSocket } from '../contexts/SocketContext';
import LoadingContainer from '../components/LoadingContainer';
import { pickImage, takePhoto, createImageFormData } from '../utils/ImagePickerUtils';
import Modal from 'react-native-modal';
import { BASE_URL } from '../constants/ApiConstant';
import { showErrorMessage } from '../utils/ErrorHandler';

// Interface for typing events
interface TypingEvent {
  idConversation: string;
  idUser: string;
}

// Interface for new message events
interface MessageEvent extends IMessage {
  idConversation: string;
}

type ChatScreenProps = {
  navigation: any;
  route: {
    params: {
      conversationId: string;
      userId: string;
      name: string;
      avatar: any;
      isGroup?: boolean;
    }
  };
};

const ChatScreen = ({ navigation, route }: ChatScreenProps) => {
  const { conversationId, userId, name, avatar, isGroup } = route.params;
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  
  const dispatch = useDispatch();
  const { messages: listMessage, isLoadingMessages: isLoading } = useSelector((state: RootState) => state.chat);
  const { isConnected } = useSocket();
  
  // Lấy tin nhắn khi màn hình được mở
  useEffect(() => {
    dispatch(getAllMessageByConversationRequest(conversationId));
    
    // Lưu thông tin người đang chat cùng
    dispatch(saveInfoChatWith({
      _id: conversationId,
      idConversation: conversationId,
      idUser: {
        _id: userId,
        name: name,
        avatar: avatar,
      },
    }));
  }, [dispatch, conversationId, userId, name, avatar]);
  
  // Thiết lập các sự kiện Socket
  useEffect(() => {
    if (!isConnected) return;
    
    const socket = getSocket();
    if (!socket) return;
    
    // Xử lý khi người dùng trong cuộc trò chuyện đang nhập tin nhắn
    socket.on('typing', (data: TypingEvent) => {
      if (data.idConversation === conversationId && data.idUser !== userId) {
        setIsTyping(true);
      }
    });
    
    socket.on('stop_typing', (data: TypingEvent) => {
      if (data.idConversation === conversationId) {
        setIsTyping(false);
      }
    });
    
    // Xử lý khi có tin nhắn mới
    socket.on('new_message', (newMessage: MessageEvent) => {
      if (newMessage.idConversation === conversationId) {
        dispatch(pushNewMesssgeToListMessage(newMessage));
      }
    });
    
    // Báo hiệu đã tham gia cuộc trò chuyện
    socket.emit('join_conversation', { idConversation: conversationId, idUser: userId });
    
    // Mark messages as seen
    socket.emit('seen_message', { idConversation: conversationId, userId: userId });
    
    return () => {
      socket.off('typing');
      socket.off('stop_typing');
      socket.off('new_message');
      socket.emit('leave_conversation', { idConversation: conversationId, idUser: userId });
    };
  }, [conversationId, userId, dispatch, isConnected]);
  
  // Báo hiệu đang nhập
  const handleTyping = () => {
    if (!isConnected) return;
    
    const socket = getSocket();
    if (socket) {
      socket.emit('typing', { idConversation: conversationId, idUser: userId });
    }
  };
  
  // Báo hiệu dừng nhập
  const handleStopTyping = () => {
    if (!isConnected) return;
    
    const socket = getSocket();
    if (socket) {
      socket.emit('stop_typing', { idConversation: conversationId, idUser: userId });
    }
  };
  
  // Gửi tin nhắn text
  const handleSend = async () => {
    if (!message.trim() || isSending) return;
    
    try {
      setIsSending(true);
      
      // Tạo dữ liệu tin nhắn với đúng cấu trúc ISendMessageParams
      const messageData: ISendMessageParams = {
        sender: userId,
        message: message.trim(),
        idConversation: conversationId,
        type: MessageType.TEXT
      };
      
      // Gửi tin nhắn đến server
      await ChatApi.sendMessage(messageData);
      
      // Xóa nội dung tin nhắn đã gửi
      setMessage('');
      
      // Báo hiệu dừng nhập
      handleStopTyping();
      
      // Cuộn xuống tin nhắn mới nhất
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };
  
  // Handle sending an image
  const handleSendImage = async (fromCamera: boolean = false) => {
    try {
      setIsSending(true);
      setShowAttachMenu(false);
      
      // Get image from gallery or camera
      const imageResult = fromCamera ? await takePhoto() : await pickImage();
      
      if (!imageResult) {
        setIsSending(false);
        return;
      }
      
      // Create form data for upload
      const formData = createImageFormData(imageResult);
      formData.append('conversationId', conversationId);
      formData.append('sender', userId);
      
      // Upload image
      await ChatApi.sendImageMessage(formData);
      
      // Cuộn xuống tin nhắn mới nhất
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
      
    } catch (error) {
      console.error('Error sending image:', error);
      showErrorMessage('Failed to send image. Please try again.');
    } finally {
      setIsSending(false);
    }
  };
  
  // Định dạng thời gian hiển thị
  const formatMessageTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return format(date, 'HH:mm');
    } catch (error) {
      return '';
    }
  };
  
  // Hiển thị ngày khi cần
  const shouldShowDate = (current: IMessage, previous: IMessage | undefined) => {
    if (!previous) return true;
    
    const currentDate = new Date(current.createdAt);
    const previousDate = new Date(previous.createdAt);
    
    return (
      currentDate.getDate() !== previousDate.getDate() ||
      currentDate.getMonth() !== previousDate.getMonth() ||
      currentDate.getFullYear() !== previousDate.getFullYear()
    );
  };
  
  // Render message content based on type
  const renderMessageContent = (item: IMessage, isCurrentUser: boolean) => {
    // Check message type
    if (item.type === MessageType.IMAGE && item.imageUrl) {
      return (
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={() => {
            // Open image in full screen viewer (could implement this later)
          }}
        >
          <Image
            source={{ uri: item.imageUrl.includes('http') ? item.imageUrl : `${BASE_URL}${item.imageUrl}` }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }
    
    // Default to text message
    return (
      <Text style={[
        styles.messageText,
        isCurrentUser ? styles.rightMessageText : styles.leftMessageText
      ]}>
        {item.message}
      </Text>
    );
  };
  
  // Render từng tin nhắn
  const renderItem = ({ item, index }: { item: IMessage; index: number }) => {
    const isCurrentUser = item.sender === userId;
    const previousMessage = index > 0 ? listMessage[index - 1] : undefined;
    const showDate = shouldShowDate(item, previousMessage);
    
    return (
      <>
        {showDate && (
          <View style={styles.dateContainer}>
            <Text style={styles.dateText}>
              {format(new Date(item.createdAt), 'dd/MM/yyyy')}
            </Text>
          </View>
        )}
        
        <View style={[
          styles.messageContainer,
          isCurrentUser ? styles.rightMessage : styles.leftMessage
        ]}>
          {!isCurrentUser && !isGroup && (
            <Image 
              source={typeof avatar === 'number' ? avatar : avatar} 
              style={styles.messageAvatar} 
            />
          )}
          
          <View style={[
            styles.messageBubble,
            isCurrentUser ? styles.rightBubble : styles.leftBubble,
            item.type === MessageType.IMAGE ? styles.imageBubble : {}
          ]}>
            {isGroup && !isCurrentUser && (
              <Text style={styles.senderName}>
                {/* Tìm tên người gửi trong danh sách thành viên */}
                {item.sender}
              </Text>
            )}
            
            {renderMessageContent(item, isCurrentUser)}
            
            <Text style={styles.timeText}>
              {formatMessageTime(item.createdAt)}
            </Text>
          </View>
        </View>
      </>
    );
  };
  
  return (
    <LoadingContainer 
      loadingId="GET_ALL_MESSAGE" 
      customLoadingMessage="Đang tải tin nhắn..."
      showOverlay={false}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={28} color="#2483ff" />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.headerInfo}
            onPress={() => {
              // Chuyển đến trang thông tin chi tiết cuộc trò chuyện
              // navigation.navigate('ChatInfo', { conversationId, isGroup });
            }}
          >
            <Image 
              source={typeof avatar === 'number' ? avatar : avatar} 
              style={styles.headerAvatar} 
            />
            <View>
              <Text style={styles.headerName} numberOfLines={1}>
                {name}
              </Text>
              {isTyping ? (
                <Text style={styles.typingText}>Đang nhập...</Text>
              ) : (
                <Text style={styles.headerStatus}>
                  {isGroup ? 'Nhóm chat' : 'Trực tuyến'}
                </Text>
              )}
            </View>
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call" size={22} color="#2483ff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam" size={22} color="#2483ff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="ellipsis-vertical" size={22} color="#2483ff" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Danh sách tin nhắn */}
        <FlatList
          ref={flatListRef}
          data={listMessage}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            !isLoading ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Chưa có tin nhắn</Text>
              </View>
            ) : null
          }
        />
        
        {/* Khu vực nhập tin nhắn */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity 
              style={styles.attachButton}
              onPress={() => setShowAttachMenu(true)}
            >
              <Ionicons name="add-circle" size={26} color="#2483ff" />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              value={message}
              onChangeText={setMessage}
              multiline
              onFocus={handleTyping}
              onBlur={handleStopTyping}
              editable={!isSending}
            />
            
            {message.trim() ? (
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={handleSend}
                disabled={isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#2483ff" />
                ) : (
                  <Ionicons name="send" size={22} color="#2483ff" />
                )}
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSendImage(false)}
                >
                  <Ionicons name="image-outline" size={22} color="#777" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleSendImage(true)}
                >
                  <Ionicons name="camera-outline" size={22} color="#777" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </KeyboardAvoidingView>
        
        {/* Attachment Menu Modal */}
        <Modal
          isVisible={showAttachMenu}
          onBackdropPress={() => setShowAttachMenu(false)}
          backdropOpacity={0.4}
          style={styles.modal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đính kèm</Text>
            
            <View style={styles.attachOptions}>
              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => {
                  setShowAttachMenu(false);
                  handleSendImage(false);
                }}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#4CAF50' }]}>
                  <Ionicons name="image" size={24} color="#fff" />
                </View>
                <Text style={styles.attachText}>Hình ảnh</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.attachOption}
                onPress={() => {
                  setShowAttachMenu(false);
                  handleSendImage(true);
                }}
              >
                <View style={[styles.attachIconContainer, { backgroundColor: '#2196F3' }]}>
                  <Ionicons name="camera" size={24} color="#fff" />
                </View>
                <Text style={styles.attachText}>Chụp ảnh</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.attachOption}>
                <View style={[styles.attachIconContainer, { backgroundColor: '#FF9800' }]}>
                  <Ionicons name="document" size={24} color="#fff" />
                </View>
                <Text style={styles.attachText}>Tài liệu</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={() => setShowAttachMenu(false)}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </SafeAreaView>
    </LoadingContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 5,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 5,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontWeight: '600',
    fontSize: 16,
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#777',
  },
  typingText: {
    fontSize: 12,
    color: '#2483ff',
    fontStyle: 'italic',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 8,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    maxWidth: '80%',
  },
  leftMessage: {
    alignSelf: 'flex-start',
  },
  rightMessage: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 5,
    alignSelf: 'flex-end',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 16,
  },
  leftBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  rightBubble: {
    backgroundColor: '#e3f2fd',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2483ff',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  leftMessageText: {
    color: '#333',
  },
  rightMessageText: {
    color: '#333',
  },
  timeText: {
    fontSize: 10,
    color: '#888',
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 15,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  attachButton: {
    padding: 5,
    marginRight: 5,
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  sendButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    height: 200,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
  imageContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    width: 200,
    height: 200,
  },
  messageImage: {
    width: '100%',
    height: '100%',
  },
  imageBubble: {
    padding: 4,
    backgroundColor: 'transparent',
  },
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  attachOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  attachOption: {
    alignItems: 'center',
    width: 80,
  },
  attachIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachText: {
    fontSize: 12,
    color: '#666',
  },
  cancelButton: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#333',
    fontWeight: '600',
  },
});

export default ChatScreen;