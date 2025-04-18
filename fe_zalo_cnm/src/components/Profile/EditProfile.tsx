import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import { updateUserRequest } from '../../redux/actions/UserAction';
import styles from './EditProfile.module.scss';

const EditProfile = () => {
    const dispatch = useDispatch();
    const { userCurrent }: any = useSelector<RootState>((state) => state.user);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        avatar: ''
    });
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        if (userCurrent) {
            setFormData({
                name: userCurrent.name || '',
                phone: userCurrent.phone || '',
                avatar: userCurrent.avatar || ''
            });
            setPreviewUrl(userCurrent.avatar || '');
        }
    }, [userCurrent]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('phone', formData.phone);
        if (avatarFile) {
            formDataToSend.append('avatar', avatarFile);
        }

        dispatch(updateUserRequest({
            id: userCurrent._id,
            data: formDataToSend
        }));
    };

    return (
        <div className={styles.edit_profile}>
            <h2>Chỉnh sửa thông tin cá nhân</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.avatar_section}>
                    <img 
                        src={previewUrl || '/default-avatar.png'} 
                        alt="Avatar preview" 
                        className={styles.avatar_preview}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className={styles.avatar_input}
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="name">Tên</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Nhập tên của bạn"
                    />
                </div>

                <div className={styles.form_group}>
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="Nhập số điện thoại"
                    />
                </div>

                <button type="submit" className={styles.submit_button}>
                    Lưu thay đổi
                </button>
            </form>
        </div>
    );
};

export default EditProfile; 